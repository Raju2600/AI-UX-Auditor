import React, { useState } from 'react';
import type { UsabilityTest, Highlight } from '../types';

const getTagColor = (tag: Highlight['tag']) => {
    switch (tag) {
        case 'Frustration': return 'bg-red-500/20 text-red-300';
        case 'Confusion': return 'bg-yellow-500/20 text-yellow-300';
        case 'Discovery': return 'bg-blue-500/20 text-blue-300';
        case 'Success': return 'bg-green-500/20 text-green-300';
        default: return 'bg-slate-500/20 text-slate-300';
    }
}

const UsabilityTesting: React.FC<{ data: UsabilityTest[] }> = ({ data }) => {
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);
  const selectedTest = data[selectedTestIndex];

  if (!selectedTest) {
    return <div>No usability test data available.</div>;
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 ring-1 ring-white/10 animate-fade-in">
      <h3 className="text-2xl font-bold text-slate-200 mb-4">Usability Tests</h3>
      
      {/* Participant Selector */}
      <div className="mb-6 flex space-x-2">
        {data.map((test, index) => (
          <button
            key={test.participant.id}
            onClick={() => setSelectedTestIndex(index)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedTestIndex === index
                ? 'bg-brand-blue text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Participant {test.participant.id}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel: Details and Transcript */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-slate-200 mb-2">Participant Details</h4>
            <p className="text-slate-300"><strong>ID:</strong> {selectedTest.participant.id}</p>
            <p className="text-slate-300"><strong>Location:</strong> {selectedTest.participant.location}</p>
            <p className="text-slate-300"><strong>Device:</strong> {selectedTest.participant.device}</p>
            <p className="text-slate-300"><strong>Demographics:</strong> {selectedTest.participant.demographics}</p>
          </div>
           <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-slate-200 mb-2">AI Summary of Session</h4>
            <p className="text-slate-300 italic">{selectedTest.aiOverallSummary}</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-slate-200 mb-2">Transcript</h4>
            <p className="text-slate-300 text-sm max-h-60 overflow-y-auto pr-2">{selectedTest.transcript}</p>
          </div>
        </div>
        
        {/* Right Panel: Highlight Reel */}
        <div className="lg:col-span-2 bg-slate-700/50 p-4 rounded-lg">
          <h4 className="font-bold text-lg text-slate-200 mb-4">Highlight Reel</h4>
          <div className="space-y-4">
            {selectedTest.highlightReel.map((highlight, index) => (
              <div key={index} className="bg-slate-800 p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTagColor(highlight.tag)}`}>
                    {highlight.tag}
                  </span>
                  <span className="text-xs text-slate-400">{highlight.timestamp}</span>
                </div>
                <p className="text-slate-300 italic">"{highlight.quote}"</p>
                <p className="text-xs text-slate-400 mt-2">{highlight.aiSummary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsabilityTesting;
