
import React from 'react';
import { FeedItem } from '../types';

interface BalancedFeedProps {
  items: FeedItem[];
  onSelect: (content: string) => void;
}

const BalancedFeed: React.FC<BalancedFeedProps> = ({ items, onSelect }) => {
  const getLabelColor = (score: number) => {
    if (score <= -1.6) return 'text-blue-600 border-blue-600';
    if (score <= -0.9) return 'text-blue-400 border-blue-400';
    if (score <= 0.8) return 'text-slate-400 border-slate-400';
    if (score <= 1.5) return 'text-red-400 border-red-400';
    return 'text-red-600 border-red-600';
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="display-font text-3xl font-bold text-slate-900">Global Perspective Feed</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time bias neutralization in progress</p>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           Live Stream Sync
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group flex flex-col md:flex-row md:items-start gap-6"
            onClick={() => onSelect(item.content)}
          >
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-lg font-black text-indigo-600 group-hover:scale-110 transition-transform">
              {item.author[0]}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.author}</span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{item.platform}</span>
                </div>
                <div className={`px-3 py-1 border-2 rounded-full text-[9px] font-black uppercase tracking-widest ${getLabelColor(item.biasScore)}`}>
                  {item.biasLabel}
                </div>
              </div>
              <p className="display-font text-2xl text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                "{item.content}"
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                   Neutralize Post <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest ml-auto">{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BalancedFeed;
