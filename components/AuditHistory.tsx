
import React from 'react';
import type { AuditHistoryItem } from '../types';

interface AuditHistoryProps {
  history: AuditHistoryItem[];
  onSelect: (item: AuditHistoryItem) => void;
  onClear: () => void;
}

const AuditHistory: React.FC<AuditHistoryProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 ring-1 ring-white/10 mb-10 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-200">Audit History</h3>
        <button
          onClick={onClear}
          className="text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-1 rounded-md hover:bg-slate-700/50"
          aria-label="Clear all audit history"
        >
          Clear History
        </button>
      </div>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2" role="list">
        {history.map((item, index) => (
          <li key={`${item.url}-${index}`}>
            <button
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              role="button"
              aria-label={`View audit for ${item.url} from ${new Date(item.date).toLocaleString()}`}
            >
              <p className="font-semibold text-slate-300 truncate" title={item.url}>{item.url}</p>
              <p className="text-xs text-slate-400">{new Date(item.date).toLocaleString()}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditHistory;
