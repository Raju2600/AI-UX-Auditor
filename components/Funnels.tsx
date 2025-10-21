import React from 'react';
import type { ConversionFunnel } from '../types';

const Funnels: React.FC<{ data: ConversionFunnel }> = ({ data }) => {
  const maxUsers = Math.max(...data.steps.map(step => step.userCount), 0);
  
  const getDropOff = (currentCount: number, prevCount: number | undefined) => {
    if (prevCount === undefined || prevCount === 0) return null;
    const dropOff = ((prevCount - currentCount) / prevCount) * 100;
    return dropOff.toFixed(1);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 ring-1 ring-white/10 animate-fade-in">
      <h3 className="text-2xl font-bold text-slate-200 mb-6">Conversion Funnel</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {data.steps.map((step, index) => {
            const widthPercentage = maxUsers > 0 ? (step.userCount / maxUsers) * 100 : 0;
            const prevStep = index > 0 ? data.steps[index - 1] : undefined;
            const dropOff = getDropOff(step.userCount, prevStep?.userCount);
            
            return (
              <div key={step.name}>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-semibold text-slate-300">{step.name}</span>
                  <span className="text-slate-400">{step.userCount.toLocaleString()} Users</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-8">
                  <div 
                    className="bg-gradient-to-r from-brand-blue to-brand-teal rounded-full h-8 flex items-center justify-end pr-3"
                    style={{ width: `${widthPercentage}%` }}
                  >
                  </div>
                </div>
                {dropOff && (
                  <p className="text-right text-xs text-red-400 mt-1">
                    ▼ {dropOff}% drop-off
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="lg:col-span-1 bg-slate-700/50 p-4 rounded-lg">
          <h4 className="font-bold text-lg text-slate-200 mb-2">AI Summary</h4>
          <p className="text-slate-300">{data.aiSummary}</p>
        </div>
      </div>
    </div>
  );
};

export default Funnels;
