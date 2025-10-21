import React from 'react';
import { DashboardIcon, HeatmapIcon, FunnelIcon, UsersIcon } from './icons';

export type View = 'dashboard' | 'heatmaps' | 'funnels' | 'usability';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand-blue text-white'
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </button>
);

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard' as View, icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'heatmaps' as View, icon: <HeatmapIcon />, label: 'Heatmaps' },
    { id: 'funnels' as View, icon: <FunnelIcon />, label: 'Funnels' },
    { id: 'usability' as View, icon: <UsersIcon />, label: 'Usability Tests' },
  ];

  return (
    <aside className="w-64 bg-slate-800/50 p-4 rounded-xl ring-1 ring-white/10 flex flex-col space-y-2">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavItem
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
