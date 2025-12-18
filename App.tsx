
import React, { useState, useCallback, useEffect } from 'react';
import { analyzePost, fetchGlobalFeed, generateSpeech } from './services/geminiService';
import { AnalysisState, Viewpoint, SocialPlatform, PlatformId, FeedItem, AnalysisResult } from './types';
import EchoGauge from './components/EchoGauge';
import SocialConnector from './components/SocialConnector';
import RubricDisplay from './components/RubricDisplay';
import BalancedFeed from './components/BalancedFeed';
import LandingPage from './components/LandingPage';

const INITIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2', connected: false },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E4405F', connected: false },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#FF0000', connected: false },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok', color: '#000000', connected: false },
  { id: 'twitter', name: 'X / Twitter', icon: 'twitter', color: '#000000', connected: false },
];

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharedViewpointIdx, setSharedViewpointIdx] = useState<number | null>(null);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(INITIAL_PLATFORMS);
  const [isSyncing, setIsSyncing] = useState<PlatformId | null>(null);
  const [globalFeed, setGlobalFeed] = useState<FeedItem[]>([]);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const [state, setState] = useState<AnalysisState>({
    data: null,
    links: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    fetchGlobalFeed().then(setGlobalFeed);
    const savedHistory = localStorage.getItem('bf_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('bf_platforms');
    if (saved) setPlatforms(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('bf_platforms', JSON.stringify(platforms));
  }, [platforms]);

  const handleAnalyze = useCallback(async (textOverride?: string) => {
    const textToAnalyze = textOverride || inputText;
    if (!textToAnalyze.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null, data: null, links: [] }));
    try {
      const { result, links } = await analyzePost(textToAnalyze);
      setState({ data: result, links, loading: false, error: null });
      
      // Update history
      const newHistory = [result, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('bf_history', JSON.stringify(newHistory));

      if (!textOverride) setInputText('');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message || 'Analysis failed' }));
    }
  }, [inputText, history]);

  const handleAudioBriefing = async () => {
    if (!state.data || isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const base64 = await generateSpeech(state.data.summary);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const decodeBase64 = (base64: string) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      };

      const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }
        return buffer;
      };

      const audioBuffer = await decodeAudioData(decodeBase64(base64), audioCtx);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlayingAudio(false);
      source.start();
    } catch (e) {
      console.error(e);
      setIsPlayingAudio(false);
    }
  };

  const handleShareViewpoint = async (viewpoint: Viewpoint, index: number) => {
    const shareData = {
      title: `Balanced Perspective: ${viewpoint.title}`,
      text: `${viewpoint.title}\n\nSummary: ${viewpoint.summary}\n\nVia BalanceFeed - Impartiality as a Service`,
      url: viewpoint.url
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const copyText = `${shareData.title}\n${shareData.text}\nSource: ${shareData.url}`;
        await navigator.clipboard.writeText(copyText);
        setSharedViewpointIdx(index);
        setTimeout(() => setSharedViewpointIdx(null), 2000);
      }
    } catch (err) {
      console.error('Error sharing viewpoint:', err);
    }
  };

  const handleConnectPlatform = (id: PlatformId) => {
    const platform = platforms.find(p => p.id === id);
    if (!platform) return;
    const simulatedAuth = confirm(`Link ${platform.name} securely with BalanceFeed?`);
    if (simulatedAuth) {
      setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: true, username: `@user_synced`, lastSynced: new Date().toISOString() } : p));
    }
  };

  const handleDisconnectPlatform = (id: PlatformId) => {
    if (confirm(`Revoke platform access?`)) {
      setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: false } : p));
    }
  };

  const handleAnalyzeFeed = (id: PlatformId) => {
    setIsSyncing(id);
    setTimeout(() => {
      setIsSyncing(null);
      handleAnalyze("Social media trends suggest a shift in public opinion regarding recent environmental policies.");
    }, 1500);
  };

  const handleShareReport = async () => {
    if (!state.data) return;
    const shareText = `BalanceFeed Report: ${state.data.biasLeaning}\nScore: ${state.data.echoChamberRating}/10`;
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showDashboard) {
    return <LandingPage onEnter={() => setShowDashboard(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center">
      {/* Sticky Premium Header */}
      <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200/50 px-6 py-4 flex items-center justify-center">
        <div className="max-w-6xl w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDashboard(false)}
              className="w-10 h-10 bg-midnight rounded-xl flex items-center justify-center text-white font-bold text-xl hover:scale-105 transition-transform"
            >
              B
            </button>
            <div className="hidden sm:block">
              <h1 className="display-font text-lg font-black tracking-tight text-slate-900 leading-none">BalanceFeed</h1>
              <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">Impartiality as a Service</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rubric v2.0 Live</span>
             </div>
             <button 
               onClick={() => setShowDashboard(false)}
               className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors"
             >
               Mission
             </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl px-6 py-12 space-y-12 animate-in fade-in duration-700">
        
        {/* Hub Selection */}
        <SocialConnector 
          platforms={platforms} 
          onConnect={handleConnectPlatform} 
          onDisconnect={handleDisconnectPlatform}
          onAnalyzeFeed={handleAnalyzeFeed} 
          isSyncing={isSyncing}
        />

        {/* Primary Action Area */}
        <section className="bg-white rounded-[2rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              01
            </div>
            <h2 className="display-font text-2xl font-bold text-slate-900">Quantify Perspective</h2>
          </div>
          
          <div className="relative">
            <textarea
              className="w-full h-40 p-6 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 outline-none transition-all resize-none text-slate-800 text-lg font-light leading-relaxed placeholder:text-slate-300"
              placeholder="Paste any post, article snippet, or news headline here for a clinical bias analysis..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={state.loading || !inputText.trim()}
            className="mt-8 w-full group relative bg-midnight text-white font-bold py-5 rounded-2xl overflow-hidden hover:shadow-2xl transition-all disabled:opacity-30 active:scale-[0.99]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 tracking-widest uppercase text-sm">
              {state.loading ? 'Neutralizing Context...' : 'Execute Analysis'}
            </span>
            <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </section>

        {state.data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Integrity Score</h3>
                  <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Verified</div>
                </div>
                <EchoGauge score={state.data.echoChamberRating} />
              </div>
              
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                 <RubricDisplay scores={state.data.rubric!} />
              </div>

              {state.links && state.links.length > 0 && (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Verification Sources</h3>
                  <div className="space-y-4">
                    {state.links.map((link, idx) => link.web && (
                      <div key={idx} className="group">
                        <a href={link.web.uri} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors block truncate">
                          {link.web.title}
                        </a>
                        <p className="text-[9px] text-slate-400 truncate uppercase tracking-tighter mt-0.5">{link.web.uri}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            <section className="lg:col-span-8 space-y-10">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-50 pb-8">
                   <div>
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-2">Analysis Result</p>
                     <h2 className="display-font text-5xl font-black text-slate-900 tracking-tighter">
                       {state.data.biasLeaning}
                     </h2>
                   </div>
                   <div className="flex gap-3">
                     <button 
                       onClick={handleAudioBriefing}
                       disabled={isPlayingAudio}
                       className={`flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-indigo-600 hover:text-white transition-all ${isPlayingAudio ? 'animate-pulse opacity-50' : ''}`}
                     >
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm-4 4a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm8 2a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM3 9a1 1 0 011 1v0a1 1 0 11-2 0v0a1 1 0 011-1z" /></svg>
                       {isPlayingAudio ? 'Briefing Live' : 'Audio Briefing'}
                     </button>
                     <button onClick={handleShareReport} className="px-6 py-3 border-2 border-slate-900 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-slate-900 hover:text-white transition-all">
                       {copied ? 'Copied' : 'Share Intelligence'}
                     </button>
                   </div>
                </div>

                <div className="space-y-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Executive Summary</h4>
                    <p className="text-xl text-slate-700 leading-relaxed font-light">{state.data.summary}</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diverse Perspectives</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {state.data.viewpoints.map((v, i) => (
                        <div key={i} className="group p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all hover:bg-white hover:shadow-xl relative">
                          <div className="flex justify-between items-start mb-2 pr-12">
                            <a href={v.url} target="_blank" rel="noreferrer">
                              <h5 className="display-font text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{v.title}</h5>
                            </a>
                          </div>
                          <p className="text-slate-500 italic text-sm line-clamp-2 mb-4">{v.summary}</p>
                          <div className="flex items-center justify-between">
                             <a href={v.url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                               Read Full Story <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                             </a>
                             <button 
                               onClick={() => handleShareViewpoint(v, i)}
                               className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
                             >
                               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                               {sharedViewpointIdx === i ? 'Copied' : 'Share Perspective'}
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Intelligence Archive */}
        {history.length > 0 && (
          <section className="bg-white rounded-[2rem] p-10 border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Intelligence Archive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((h, i) => (
                <div 
                  key={i} 
                  onClick={() => setState({ data: h, links: [], loading: false, error: null })}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:border-indigo-300 transition-all hover:bg-white hover:shadow-md group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Report 0{history.length - i}</span>
                    <span className="text-[9px] font-bold text-slate-400">Score: {h.echoChamberRating}/10</span>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{h.biasLeaning}</h4>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">{h.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <BalancedFeed items={globalFeed} onSelect={handleAnalyze} />

      </main>

      <footer className="w-full py-20 bg-midnight text-white flex flex-col items-center text-center px-6">
        <div className="display-font text-4xl font-bold mb-4 tracking-tighter">BalanceFeed</div>
        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12">Impartiality as a Service</div>
        <p className="text-xs text-slate-500 max-w-lg mb-12">Restoring neutral discourse through clinical AI analysis and rigorous bias quantification. Data processed ephemerally.</p>
        <button onClick={() => { setShowDashboard(false); window.scrollTo(0,0); }} className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 hover:text-white transition-colors">Return to Entrance</button>
      </footer>
    </div>
  );
};

export default App;
