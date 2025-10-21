import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisReport, Intrusiveness, AccessibilityIssue, Popup } from '../types';
import ReportCard from './ReportCard';
import ScoreGauge from './ScoreGauge';
import { BoltIcon, UniversalAccessIcon, AdsIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from './icons';

const IntrusivenessBadge: React.FC<{ level: Intrusiveness }> = ({ level }) => {
  const styles = {
    [ 'Low' as Intrusiveness ]: 'bg-green-500/20 text-green-300',
    [ 'Medium' as Intrusiveness ]: 'bg-yellow-500/20 text-yellow-300',
    [ 'High' as Intrusiveness ]: 'bg-red-500/20 text-red-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>{level}</span>;
};

const PopupAnalysis: React.FC<{ popups: Popup[] }> = ({ popups }) => (
  <div>
    {popups.length > 0 ? (
      <ul className="space-y-4">
        {popups.map((popup, index) => (
          <li key={index} className="flex items-start justify-between gap-4 p-3 bg-slate-700/50 rounded-lg">
            <div>
              <p className="font-semibold text-slate-300">{popup.type}</p>
              <p className="text-sm text-slate-400">Trigger: {popup.trigger}</p>
            </div>
            <IntrusivenessBadge level={popup.intrusiveness} />
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center text-slate-400 py-4">No pop-ups detected.</div>
    )}
  </div>
);

const AccessibilityIssueItem: React.FC<{ issue: AccessibilityIssue }> = ({ issue }) => (
    <div className="p-3 bg-slate-700/50 rounded-lg">
        <h4 className="font-semibold text-slate-300 mb-1">{issue.issue}</h4>
        <p className="text-sm text-slate-400 mb-2">{issue.explanation}</p>
        <p className="text-sm text-brand-teal/80"><strong>Recommendation:</strong> {issue.recommendation}</p>
    </div>
);


const Dashboard: React.FC<{ data: AnalysisReport }> = ({ data }) => {
  const COLORS = ['#00BFFF', '#00F5D4', '#8884d8'];
  const durationInMinutes = (data.dashboard.avgSessionDuration / 60).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Behavioral Metrics */}
        <ReportCard title="Total Sessions" icon={<div className="text-2xl font-bold">{data.dashboard.totalSessions.toLocaleString()}</div>}>
            <p className="text-sm text-slate-400">A high-level look at site traffic.</p>
        </ReportCard>
         <ReportCard title="Bounce Rate" icon={<div className="text-2xl font-bold">{data.dashboard.bounceRate}%</div>}>
            <p className="text-sm text-slate-400">Users leaving after one page.</p>
        </ReportCard>
         <ReportCard title="Avg. Session" icon={<div className="text-2xl font-bold">{durationInMinutes} min</div>}>
            <p className="text-sm text-slate-400">Average time spent on site.</p>
        </ReportCard>
        
        {/* Device Breakdown */}
        <div className="lg:col-span-1 md:col-span-2">
            <ReportCard title="Device Breakdown" icon={<div />}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={data.dashboard.deviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {data.dashboard.deviceBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} 
                            itemStyle={{ color: '#ffffff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </ReportCard>
        </div>

        {/* Load Speed */}
        <div className="lg:col-span-2 md:col-span-2">
            <ReportCard title="Load Speed" icon={<BoltIcon />}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                    <ScoreGauge score={data.loadSpeed.score} />
                    <div className="text-center grid grid-cols-3 gap-2">
                        <div>
                            <p className="text-xs text-slate-400">FCP</p>
                            <p className="font-bold text-lg">{data.loadSpeed.fcp}s</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">LCP</p>
                            <p className="font-bold text-lg">{data.loadSpeed.lcp}s</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">CLS</p>
                            <p className="font-bold text-lg">{data.loadSpeed.cls}</p>
                        </div>
                    </div>
                </div>
            </ReportCard>
        </div>

        {/* Accessibility */}
        <div className="lg:col-span-3">
            <ReportCard title="Accessibility" icon={<UniversalAccessIcon />}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex items-center justify-center">
                        <ScoreGauge score={data.accessibility.score} />
                    </div>
                    <div className="lg:col-span-2 space-y-3">
                        {data.accessibility.issues.map((issue, i) => (
                            <AccessibilityIssueItem key={i} issue={issue} />
                        ))}
                    </div>
                </div>
            </ReportCard>
        </div>
      
        {/* Pop-up Behavior */}
        <div className="lg:col-span-3">
            <ReportCard title="Pop-up Behavior" icon={<AdsIcon />}>
                <PopupAnalysis popups={data.popupBehavior.popups} />
            </ReportCard>
        </div>
    </div>
  );
};

export default Dashboard;