
import React, { useState } from 'react';
import { SocialPlatform, PlatformId } from '../types';

interface SocialConnectorProps {
  onConnect: (platformId: PlatformId) => void;
  onDisconnect: (platformId: PlatformId) => void;
  onAnalyzeFeed: (platformId: PlatformId) => void;
  platforms: SocialPlatform[];
  isSyncing: PlatformId | null;
}

const SocialConnector: React.FC<SocialConnectorProps> = ({ 
  onConnect, 
  onDisconnect, 
  onAnalyzeFeed, 
  platforms,
  isSyncing
}) => {
  const [isExpanding, setIsExpanding] = useState(false);

  const getPlatformIcon = (id: PlatformId, className: string = "w-5 h-5") => {
    switch (id) {
      case 'facebook':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.16 1.02.16 2.12.87 2.89.69.78 1.76 1.15 2.8 1.07 1.05-.05 2.04-.61 2.66-1.46.4-.53.59-1.14.63-1.81-.02-3.37-.03-6.75-.03-10.12z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>
        );
      default:
        // Use type assertion to string since this block is unreachable given PlatformId definition
        // but TypeScript requires a return value for all code paths.
        const platformId = id as string;
        return <span>{platformId[0]?.toUpperCase() || '?'}</span>;
    }
  };

  const formatLastSynced = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return `Synced ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return null;
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanding(!isExpanding)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Connection Status Hub</h2>
            <p className="text-sm text-slate-500">Monitor and manage your active social feed integrations</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex -space-x-2">
            {platforms.filter(p => p.connected).map(p => (
              <div 
                key={p.id} 
                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: p.color }}
                title={p.name}
              >
                {getPlatformIcon(p.id, "w-3.5 h-3.5")}
              </div>
            ))}
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
            {platforms.filter(p => p.connected).length} Connected
          </div>
          <svg 
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanding ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanding && (
        <div className="p-6 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <div 
                key={platform.id}
                className={`group p-4 rounded-xl border transition-all flex flex-col justify-between h-44 ${
                  platform.connected 
                    ? 'bg-white border-indigo-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: platform.color }}
                    >
                      {getPlatformIcon(platform.id, "w-5 h-5")}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{platform.name}</h3>
                      {platform.connected ? (
                        <div className="flex flex-col">
                          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-tighter">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Status: Active
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium">
                            {platform.username || 'Authenticated'}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Status: Offline
                        </p>
                      )}
                    </div>
                  </div>
                  {platform.connected && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDisconnect(platform.id); }}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                      title="Revoke access"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="mt-auto space-y-3">
                  {platform.connected && platform.lastSynced && (
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                      <span>Last Sync</span>
                      <span className="text-indigo-500">{formatLastSynced(platform.lastSynced)}</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-slate-50">
                    <button
                      onClick={() => platform.connected ? onAnalyzeFeed(platform.id) : onConnect(platform.id)}
                      disabled={isSyncing !== null}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                        platform.connected 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'
                      }`}
                    >
                      {isSyncing === platform.id ? (
                        <>
                          <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Syncing...
                        </>
                      ) : platform.connected ? (
                        'Refresh & Analyze'
                      ) : (
                        `Link ${platform.name}`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-500 flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your connection status is managed via ephemeral tokens. Disconnecting a platform revokes BalanceFeed's read access immediately.</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialConnector;
