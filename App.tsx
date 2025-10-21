import React, { useState, useCallback, useEffect } from 'react';
import type { AnalysisReport, AuditHistoryItem } from './types';
import { auditWebsite } from './services/geminiService';
import Spinner from './components/Spinner';
import AuditHistory from './components/AuditHistory';
import Sidebar, { View } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap';
import Funnels from './components/Funnels';
import UsabilityTesting from './components/UsabilityTesting';

const URLInputForm: React.FC<{
  url: string;
  setUrl: (url: string) => void;
  onAudit: () => void;
  isLoading: boolean;
}> = ({ url, setUrl, onAudit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAudit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        className="flex-grow bg-slate-800 text-white placeholder-slate-500 px-4 py-3 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue transition duration-200"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-sky-400 transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? 'Auditing...' : 'Analyze Website'}
      </button>
    </form>
  );
};


const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditHistoryItem[]>([]);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('auditHistory');
      if (storedHistory) {
        setAuditHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load audit history from localStorage", e);
      localStorage.removeItem('auditHistory');
    }
  }, []);

  const handleAudit = useCallback(async () => {
    if (!url) {
      setError('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setActiveView('dashboard');

    try {
      const result = await auditWebsite(url);
      setAnalysisResult(result);

      const newHistoryItem: AuditHistoryItem = {
        url,
        date: new Date().toISOString(),
        report: result,
      };

      const updatedHistory = [newHistoryItem, ...auditHistory.filter(item => item.url !== url)];
      setAuditHistory(updatedHistory);
      localStorage.setItem('auditHistory', JSON.stringify(updatedHistory));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [url, auditHistory]);

  const handleSelectHistory = useCallback((item: AuditHistoryItem) => {
    setUrl(item.url);
    setAnalysisResult(item.report);
    setError(null);
    setIsLoading(false);
    setActiveView('dashboard');
  }, []);

  const handleClearHistory = useCallback(() => {
    setAuditHistory([]);
    localStorage.removeItem('auditHistory');
  }, []);

  const renderActiveView = () => {
    if (!analysisResult) return null;

    switch (activeView) {
      case 'dashboard':
        return <Dashboard data={analysisResult} />;
      case 'heatmaps':
        return <Heatmap data={analysisResult.heatmaps} />;
      case 'funnels':
        return <Funnels data={analysisResult.conversionFunnel} />;
      case 'usability':
        return <UsabilityTesting data={analysisResult.usabilityTests} />;
      default:
        return <Dashboard data={analysisResult} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-teal">
            AI UX Auditor Pro
          </h1>
          <p className="text-lg text-slate-400">
            Comprehensive, AI-powered behavioral analytics for any website.
          </p>
        </header>

        <main className="flex flex-col">
          <div className="mb-10">
            <URLInputForm url={url} setUrl={setUrl} onAudit={handleAudit} isLoading={isLoading} />
          </div>

          {auditHistory.length > 0 && !analysisResult && !isLoading && (
            <AuditHistory
              history={auditHistory}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
            />
          )}

          {isLoading && <Spinner />}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center max-w-2xl mx-auto">
              <strong>Error:</strong> {error}
            </div>
          )}

          {analysisResult && (
             <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-auto">
                    <Sidebar activeView={activeView} setActiveView={setActiveView} />
                    <div className="mt-6 block lg:hidden">
                      <AuditHistory
                        history={auditHistory}
                        onSelect={handleSelectHistory}
                        onClear={handleClearHistory}
                      />
                    </div>
                </div>
                <div className="flex-grow w-full">
                    {renderActiveView()}
                </div>
                <div className="w-64 hidden lg:block">
                     <AuditHistory
                        history={auditHistory}
                        onSelect={handleSelectHistory}
                        onClear={handleClearHistory}
                      />
                </div>
            </div>
          )}
        </main>
      </div>
       <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
              animation: fade-in 0.5s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default App;
