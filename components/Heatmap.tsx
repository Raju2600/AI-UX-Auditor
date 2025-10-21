import React, { useState } from 'react';
import type { Heatmap } from '../types';

type HeatmapType = 'click' | 'scroll' | 'move';

const HeatmapVisual: React.FC<{ data: Heatmap }> = ({ data }) => {
  const getDotColor = (type: HeatmapType, intensity: number) => {
    if (type === 'click') return `rgba(255, 75, 75, ${intensity * 0.8})`; // Red for clicks
    if (type === 'move') return `rgba(75, 192, 192, ${intensity * 0.5})`; // Teal for moves
    return `rgba(255, 205, 86, ${intensity * 0.6})`; // Yellow for scroll
  };

  return (
    <div className="relative w-full aspect-video bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
      {/* Placeholder for website screenshot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-slate-500 text-2xl font-bold">Website Preview</span>
      </div>
      
      {data.points.map((point, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: data.type === 'scroll' ? '100%' : '20px',
            height: '20px',
            backgroundColor: getDotColor(data.type, point.intensity),
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 15px 5px ${getDotColor(data.type, point.intensity)}`,
            opacity: 0.75,
          }}
        />
      ))}
    </div>
  );
};

const Heatmap: React.FC<{ data: Heatmap[] }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<HeatmapType>('click');

  const activeMap = data.find(map => map.type === activeTab) || data[0];

  const tabs: { id: HeatmapType; label: string }[] = [
    { id: 'click', label: 'Click Map' },
    { id: 'scroll', label: 'Scroll Map' },
    { id: 'move', label: 'Move Map' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 ring-1 ring-white/10 animate-fade-in">
        <h3 className="text-2xl font-bold text-slate-200 mb-4">Heatmaps</h3>
        <div className="mb-4 border-b border-slate-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
                >
                {tab.label}
                </button>
            ))}
            </nav>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <HeatmapVisual data={activeMap} />
            </div>
            <div className="lg:col-span-1 bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-bold text-lg text-slate-200 mb-2">AI Summary</h4>
                <p className="text-slate-300">{activeMap.aiSummary}</p>
            </div>
        </div>
    </div>
  );
};

export default Heatmap;
