
export interface Viewpoint {
  title: string;
  url: string;
  summary: string;
}

export interface RubricScores {
  storySelection: number;
  languageFraming: number;
  policyCharacterization: number;
  opposingViewsTreatment: number;
  sourceSelection: number;
  omissionOfFacts: number;
  headlineVisual: number;
  policyEndorsement: number;
  averageScore: number;
}

export interface AnalysisResult {
  biasLeaning: string;
  biasSource: string;
  biasSourceUrl: string;
  echoChamberRating: number;
  neutralReply: string;
  summary: string;
  viewpoints: Viewpoint[];
  rubric?: RubricScores;
}

export interface FeedItem {
  id: string;
  platform: PlatformId;
  author: string;
  content: string;
  timestamp: string;
  biasScore: number; // -2 to +2
  biasLabel: string; // "Strong Left" to "Strong Right"
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisState {
  data: AnalysisResult | null;
  links: GroundingChunk[];
  loading: boolean;
  error: string | null;
}

export type PlatformId = 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'twitter';

export interface SocialPlatform {
  id: PlatformId;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSynced?: string;
  username?: string;
  accessToken?: string;
}
