import React from 'react';
import { UserProfile } from '../types';

export type NavView = 'dashboard' | 'chat' | 'study-plan';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  user: UserProfile;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, user, onLogout }) => {
  const navItem = (view: NavView, label: string) => (
    <button
      onClick={() => onNavigate(view)}
      className={`font-semibold text-sm transition-all pb-1 ${
        currentView === view
          ? 'text-[#adc6ff] border-b-2 border-[#adc6ff]'
          : 'text-[#c2c6d6] hover:text-[#adc6ff]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-[#0d1322]/85 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <span className="material-symbols-outlined text-[#3B82F6] text-3xl group-hover:scale-110 transition-transform">
            psychology
          </span>
          <span className="font-extrabold text-[28px] tracking-tight text-[#adc6ff]">StudyAI</span>
        </button>

        <div className="hidden md:flex gap-6 items-center">
          {navItem('dashboard', 'Dashboard')}
          {navItem('chat', 'Tanya AI')}
          {navItem('study-plan', 'Study Plan')}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-[#dde2f8] leading-tight">{user.username}</p>
          <p className="text-[11px] text-[#94A3B8] leading-tight">{user.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="text-[#dde2f8] hover:text-[#adc6ff] transition-colors text-sm font-semibold hover:bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
