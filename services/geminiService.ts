
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, GroundingChunk, FeedItem } from "../types";

export async function analyzePost(postContent: string): Promise<{ result: AnalysisResult; links: GroundingChunk[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following social media post for BalanceFeed using the Political Bias Detection Rubric v2.0 (2025).
      
      Post: "${postContent}"
      
      Your goals:
      1. Detect likely bias/leaning (reference reliable ratings like AllSides, Ground News, or Media Bias/Fact Check).
      2. Calculate scores for all 8 rubric categories (-2 to +2 scale).
      3. Provide a short summary of the core claim.
      4. Rate echo chamber contribution (1-10).
      5. Suggest one open-ended, neutral, and thoughtful reply sentence.
      6. Provide a direct URL to the source rating page for the detected bias.
      7. Provide 3 diverse counter-viewpoints (Title, URL, 1-sentence summary).
      
      Return the analysis in JSON format. Use Google Search for the viewpoints.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            biasLeaning: { type: Type.STRING },
            biasSource: { type: Type.STRING },
            biasSourceUrl: { type: Type.STRING },
            summary: { type: Type.STRING },
            echoChamberRating: { type: Type.NUMBER },
            neutralReply: { type: Type.STRING },
            rubric: {
              type: Type.OBJECT,
              properties: {
                storySelection: { type: Type.NUMBER },
                languageFraming: { type: Type.NUMBER },
                policyCharacterization: { type: Type.NUMBER },
                opposingViewsTreatment: { type: Type.NUMBER },
                sourceSelection: { type: Type.NUMBER },
                omissionOfFacts: { type: Type.NUMBER },
                headlineVisual: { type: Type.NUMBER },
                policyEndorsement: { type: Type.NUMBER },
                averageScore: { type: Type.NUMBER }
              },
              required: ["storySelection", "languageFraming", "policyCharacterization", "opposingViewsTreatment", "sourceSelection", "omissionOfFacts", "headlineVisual", "policyEndorsement", "averageScore"]
            },
            viewpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["title", "url", "summary"]
              }
            }
          },
          required: ["biasLeaning", "biasSource", "biasSourceUrl", "summary", "echoChamberRating", "neutralReply", "viewpoints", "rubric"]
        }
      }
    });

    const jsonStr = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonStr);
    const links: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { result, links };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze post.");
  }
}

export async function generateSpeech(text: string): Promise<string> {
  // Always use { apiKey: process.env.API_KEY } for initialization as per coding guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this analysis summary in a professional, neutral, and clear broadcasting voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
}

export async function fetchGlobalFeed(): Promise<FeedItem[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 realistic social media posts spanning the political spectrum. Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              platform: { type: Type.STRING },
              author: { type: Type.STRING },
              content: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              biasScore: { type: Type.NUMBER },
              biasLabel: { type: Type.STRING }
            },
            required: ["id", "platform", "author", "content", "timestamp", "biasScore", "biasLabel"]
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    return [];
  }
}
