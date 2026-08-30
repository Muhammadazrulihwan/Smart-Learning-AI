import React, { useState } from 'react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'dashboard' | 'study-plan' | 'document-detail';
  onNavigate: (view: 'dashboard' | 'study-plan') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: UserProfile;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  user,
  onLogout,
  onOpenSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav
      id="top-navbar"
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-[#0d1322]/85 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center gap-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <span className="material-symbols-outlined text-[#3B82F6] text-3xl group-hover:scale-110 transition-transform">
            psychology
          </span>
          <span className="font-extrabold text-[28px] tracking-tight text-[#adc6ff]">
            StudyAI
          </span>
        </button>

        <div className="hidden md:flex gap-6 items-center">
          <button
            id="nav-dashboard-link"
            onClick={() => onNavigate('dashboard')}
            className={`font-semibold text-sm transition-all pb-1 ${
              currentView === 'dashboard'
                ? 'text-[#adc6ff] border-b-2 border-[#adc6ff]'
                : 'text-[#c2c6d6] hover:text-[#adc6ff]'
            }`}
          >
            Dashboard
          </button>
          <button
            id="nav-study-plan-link"
            onClick={() => onNavigate('study-plan')}
            className={`font-semibold text-sm transition-all pb-1 ${
              currentView === 'study-plan'
                ? 'text-[#adc6ff] border-b-2 border-[#adc6ff]'
                : 'text-[#c2c6d6] hover:text-[#adc6ff]'
            }`}
          >
            Study Plan
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] text-[20px]">
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents, topics, quizzes..."
            className="bg-[#2f3445] border border-white/5 rounded-full py-2 pl-10 pr-4 text-[#dde2f8] placeholder:text-[#94A3B8] focus:ring-1 focus:ring-[#adc6ff] focus:border-[#adc6ff] w-64 text-sm focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="Notifications"
            className="hover:bg-white/5 transition-colors p-2 rounded-full active:scale-95 text-[#dde2f8] relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-card bg-[#151b2b]/95 rounded-2xl p-4 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-3">
                <span className="font-bold text-sm text-[#dde2f8]">AI Notifications</span>
                <span className="text-[11px] font-semibold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-[#22D3EE] font-semibold mb-1">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>Study Plan Updated</span>
                  </div>
                  <p className="text-xs text-[#c2c6d6]">
                    New focus area recommended: <strong className="text-white">Recursion Base Cases</strong>.
                  </p>
                  <span className="text-[10px] text-[#94A3B8] mt-1 block">15m ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-[#adc6ff] font-semibold mb-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Document Parsed</span>
                  </div>
                  <p className="text-xs text-[#c2c6d6]">
                    "Data Structures 101" is ready for interactive Chat Q&A and Quizzes.
                  </p>
                  <span className="text-[10px] text-[#94A3B8] mt-1 block">2h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          id="btn-settings"
          onClick={onOpenSettings}
          aria-label="Settings"
          className="hover:bg-white/5 transition-colors p-2 rounded-full active:scale-95 text-[#dde2f8]"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* Logout direct button */}
        <button
          id="btn-logout"
          onClick={onLogout}
          className="hidden sm:block text-[#dde2f8] hover:text-[#adc6ff] transition-colors text-sm font-semibold hover:bg-white/5 px-3 py-1.5 rounded-lg"
        >
          Logout
        </button>

        {/* Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="focus:outline-none flex items-center"
          >
            <img
              alt="User avatar"
              src={user.avatarUrl}
              className="w-10 h-10 rounded-full border border-[#424754] object-cover hover:ring-2 hover:ring-[#3B82F6] transition-all"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 glass-card bg-[#151b2b]/95 rounded-2xl p-3 shadow-2xl border border-white/10 z-50">
              <div className="p-2 border-b border-white/10 mb-2">
                <p className="text-sm font-bold text-[#dde2f8]">{user.username}</p>
                <p className="text-xs text-[#94A3B8] truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigate('study-plan');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#c2c6d6] hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">school</span>
                My Learning Path
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#c2c6d6] hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                AI Preferences
              </button>
              <div className="border-t border-white/10 my-1"></div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#ffb4ab] hover:bg-[#ffb4ab]/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
