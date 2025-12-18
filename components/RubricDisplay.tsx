
import React from 'react';
import { RubricScores } from '../types';

interface RubricDisplayProps {
  scores: RubricScores;
}

const RubricDisplay: React.FC<RubricDisplayProps> = ({ scores }) => {
  const categories = [
    { label: 'Story Selection', value: scores.storySelection },
    { label: 'Language Framing', value: scores.languageFraming },
    { label: 'Policy Context', value: scores.policyCharacterization },
    { label: 'Opposing Views', value: scores.opposingViewsTreatment },
    { label: 'Source Selection', value: scores.sourceSelection },
    { label: 'Fact Omission', value: scores.omissionOfFacts },
    { label: 'Headline Framing', value: scores.headlineVisual },
    { label: 'Policy Direction', value: scores.policyEndorsement },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4 border-b border-slate-50 pb-4">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rubric v2.0</h4>
          <p className="text-xs font-bold text-slate-900 mt-1">Bias Breakdown</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-indigo-600 leading-none">{scores.averageScore.toFixed(1)}</div>
          <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Aggregate</div>
        </div>
      </div>
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <span>{cat.label}</span>
              <span className={cat.value < 0 ? 'text-blue-500' : cat.value > 0 ? 'text-red-500' : 'text-slate-400'}>
                {cat.value > 0 ? '+' : ''}{cat.value.toFixed(1)}
              </span>
            </div>
            <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-slate-200 z-10 -translate-x-1/2"></div>
              <div 
                className={`absolute top-0 bottom-0 transition-all duration-1000 ease-out ${cat.value < 0 ? 'bg-gradient-to-l from-blue-400 to-blue-600 right-1/2' : 'bg-gradient-to-r from-red-400 to-red-600 left-1/2'}`}
                style={{ 
                  width: `${Math.abs(cat.value) * 25}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[8px] text-slate-300 font-black uppercase tracking-widest pt-4">
        <span>Left (-2)</span>
        <span>Center (0)</span>
        <span>Right (+2)</span>
      </div>
    </div>
  );
};

export default RubricDisplay;
