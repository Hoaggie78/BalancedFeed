
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface EchoGaugeProps {
  score: number;
}

const EchoGauge: React.FC<EchoGaugeProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 10 - score },
  ];

  const getColor = (val: number) => {
    if (val <= 3) return '#10b981'; // emerald
    if (val <= 7) return '#6366f1'; // indigo
    return '#f43f5e'; // rose
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              <Cell fill={getColor(score)} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center -mt-10 pb-4">
        <div className="text-4xl font-black text-slate-900 tracking-tighter">{score}<span className="text-slate-200 text-xl font-bold">/10</span></div>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1">Polarization Index</p>
      </div>
    </div>
  );
};

export default EchoGauge;
