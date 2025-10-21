
import React from 'react';

interface ReportCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col h-full ring-1 ring-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-brand-teal">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-200">{title}</h3>
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default ReportCard;
