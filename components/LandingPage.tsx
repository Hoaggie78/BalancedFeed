
import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center overflow-x-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#0a0f1a]">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 max-w-5xl w-full text-center space-y-8 animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Impartiality as a Service
          </div>
          
          <h1 className="display-font text-6xl md:text-9xl text-white font-black leading-[0.9] tracking-tighter">
            Balance<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-200 to-indigo-100">Feed.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light tracking-tight">
            Neutralize social media echo chambers with rigorous bias detection and automated alternative perspectives.
          </p>
          
          <div className="pt-10">
            <button 
              onClick={onEnter}
              className="group relative px-12 py-6 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center gap-3 mx-auto overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Enter Dashboard
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Feature Section with Premium Layout */}
      <section className="w-full max-w-7xl px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="space-y-6">
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">01 / Foundation</div>
          <h3 className="display-font text-4xl font-bold text-slate-900 leading-tight">Quantified<br />Neutrality</h3>
          <p className="text-slate-500 leading-relaxed text-sm">
            Our 8-category 2025 Rubric provides a surgical breakdown of political leaning, tone, and framing.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">02 / Curation</div>
          <h3 className="display-font text-4xl font-bold text-slate-900 leading-tight">Counter<br />Perspectives</h3>
          <p className="text-slate-500 leading-relaxed text-sm">
            For every claim, we find three verified alternative viewpoints to balance your consumption in real-time.
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">03 / Privacy</div>
          <h3 className="display-font text-4xl font-bold text-slate-900 leading-tight">Zero-Store<br />Architecture</h3>
          <p className="text-slate-500 leading-relaxed text-sm">
            Your data is never stored. We use ephemeral sessions to analyze feeds without retaining personal content.
          </p>
        </div>
      </section>

      <footer className="w-full py-20 border-t border-slate-100 flex flex-col items-center text-center bg-slate-50/50">
        <div className="display-font text-3xl font-bold text-slate-900 mb-4 tracking-tighter">BalanceFeed</div>
        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4">
          <span className="w-8 h-px bg-slate-200"></span>
          Impartiality as a Service
          <span className="w-8 h-px bg-slate-200"></span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
