import React, { useState } from 'react';
import { StudyTopic, UpcomingEvent } from '../types';
import { ROBOT_AI_AVATAR } from '../data/mockData';

interface StudyPlanViewProps {
  topics: StudyTopic[];
  upcomingEvents: UpcomingEvent[];
  onNavigateHome: () => void;
  onStartLearningTopic: (topic: StudyTopic) => void;
  onOpenGlobalHelper: (contextPrompt?: string) => void;
  onOpenUpgradeModal: () => void;
  onOpenAddEventModal: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  topics,
  upcomingEvents,
  onNavigateHome,
  onStartLearningTopic,
  onOpenGlobalHelper,
  onOpenUpgradeModal,
  onOpenAddEventModal,
}) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [activeSidebarNav, setActiveSidebarNav] = useState<'home' | 'docs' | 'quiz' | 'analytics'>('home');

  return (
    <div className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-[1280px] mx-auto w-full flex flex-col md:flex-row gap-8 relative">
      {/* SideNavBar (Desktop Sidebar Area) */}
      <aside className="hidden lg:flex flex-col h-[calc(100vh-100px)] w-64 fixed left-0 top-20 bg-[#151b2b] border-r border-[#424754] z-40 py-8 px-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-12 h-12 rounded-xl overflow-hidden glass-panel border border-white/10 flex-shrink-0">
            <img
              src={ROBOT_AI_AVATAR}
              alt="StudyAI Robot"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-base text-[#adc6ff] leading-tight">
              Smart Learning
            </h2>
            <p className="text-xs text-[#c2c6d6]">AI Companion</p>
          </div>
        </div>

        <nav className="flex-grow flex flex-col gap-1.5">
          <button
            onClick={onNavigateHome}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold text-left ${
              activeSidebarNav === 'home'
                ? 'bg-white/10 text-white border border-white/5'
                : 'text-[#c2c6d6] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>Home</span>
          </button>
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold text-[#c2c6d6] hover:text-white hover:bg-white/5 text-left"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            <span>Documents</span>
          </button>
          <button
            onClick={() => onStartLearningTopic(topics[0])}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold text-[#c2c6d6] hover:text-white hover:bg-white/5 text-left"
          >
            <span className="material-symbols-outlined text-[20px]">quiz</span>
            <span>Quiz History</span>
          </button>
          <button
            onClick={() => onOpenGlobalHelper('Show me my learning velocity and analytics summary')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold text-[#c2c6d6] hover:text-white hover:bg-white/5 text-left"
          >
            <span className="material-symbols-outlined text-[20px]">insights</span>
            <span>Analytics</span>
          </button>
        </nav>

        <div className="mt-auto mb-4">
          <button
            id="btn-upgrade-pro-sidebar"
            onClick={onOpenUpgradeModal}
            className="w-full bg-[#2f3445] text-[#adc6ff] font-semibold text-xs py-3 rounded-xl hover:bg-white/10 transition-all border border-[#adc6ff]/30 shadow-sm"
          >
            Upgrade to Pro
          </button>
        </div>

        <div className="flex flex-col gap-1 pt-4 border-t border-[#424754]">
          <button
            onClick={() => onOpenGlobalHelper('How can StudyAI help me prepare for midterms?')}
            className="text-[#c2c6d6] hover:text-white flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-xs text-left"
          >
            <span className="material-symbols-outlined text-sm">help</span>
            <span>Help & FAQ</span>
          </button>
          <button
            onClick={() => alert('All uploaded materials are encrypted in-memory and strictly sandboxed for personalized study assistance.')}
            className="text-[#c2c6d6] hover:text-white flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-xs text-left"
          >
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>Privacy & Safety</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="w-full lg:ml-64 flex flex-col">
        <header className="mb-8">
          <h1 className="font-extrabold text-3xl md:text-4xl text-[#dde2f8] mb-2 tracking-tight">
            Personalized Study Plan
          </h1>
          <p className="text-[#c2c6d6] text-sm md:text-base">
            Your AI-curated path to mastery, dynamically adjusted based on your performance.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Study Plan List */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {topics.map((topic) => {
              const isError = topic.colorCategory === 'error';
              const isWarning = topic.colorCategory === 'warning';
              const isSuccess = topic.colorCategory === 'success';

              const barColor = isError
                ? 'bg-[#ffb4ab]'
                : isWarning
                ? 'bg-amber-400'
                : 'bg-emerald-400';

              const badgeColor = isError
                ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                : isWarning
                ? 'bg-amber-400/20 text-amber-300'
                : 'bg-emerald-400/20 text-emerald-300';

              const iconColor = isError
                ? 'text-[#ffb4ab]/60 group-hover:text-[#ffb4ab]'
                : isWarning
                ? 'text-amber-400/60 group-hover:text-amber-400'
                : 'text-emerald-400/60 group-hover:text-emerald-400';

              const accentBorder = isError
                ? 'bg-[#ffb4ab]'
                : isWarning
                ? 'bg-amber-400'
                : 'bg-emerald-400';

              return (
                <article
                  key={topic.id}
                  className="glass-panel rounded-2xl p-6 glow-card transition-all duration-300 relative overflow-hidden group border border-white/10 hover:border-white/20 hover:shadow-2xl"
                >
                  {/* Left accent bar */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${accentBorder}`}></div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`${badgeColor} px-2.5 py-1 rounded-md text-xs uppercase tracking-wider font-bold`}>
                          Priority {topic.priority}
                        </span>
                        <h3 className="font-bold text-xl text-[#dde2f8]">
                          {topic.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#c2c6d6] mt-1.5">
                        {topic.subtitle}
                      </p>
                    </div>

                    <span className={`material-symbols-outlined text-2xl transition-colors ${iconColor}`}>
                      {topic.statusIcon}
                    </span>
                  </div>

                  {/* Mastery Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-[#c2c6d6] mb-2 font-medium">
                      <span>Mastery Level</span>
                      <span className="font-bold text-white">{topic.mastery}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#242a3a] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${topic.mastery}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* AI Recommendation Box */}
                  <div className="bg-[#151b2b] p-4 rounded-xl border border-[#424754]/40 mb-6 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[20px] mt-0.5">
                      psychology
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#dde2f8] mb-0.5">
                        AI Recommendation
                      </p>
                      <p className="text-xs text-[#c2c6d6] leading-relaxed">
                        {topic.aiRecommendation}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onStartLearningTopic(topic)}
                      className={`font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 ${
                        isError
                          ? 'bg-[#3B82F6] hover:bg-[#005ac2] text-white glow-btn'
                          : 'bg-transparent border border-[#424754] text-[#dde2f8] hover:bg-white/10'
                      }`}
                    >
                      <span>Start Learning</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right Sidebar / Widgets */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Plan Overview */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold text-base text-[#dde2f8] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff]">trending_up</span>
                <span>Plan Overview</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#424754]">
                  <span className="text-xs text-[#c2c6d6]">Topics to Review</span>
                  <span className="text-xl font-bold text-white">{topics.length}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#424754]">
                  <span className="text-xs text-[#c2c6d6]">Estimated Time</span>
                  <span className="text-xl font-bold text-white">2.5h</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-[#c2c6d6] mb-2 font-medium">
                    <span>Weekly Goal</span>
                    <span className="text-[#adc6ff] font-bold">45%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#242a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B82F6] rounded-full progress-glow"
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Exams / Deadlines */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base text-[#dde2f8] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cd7f6]">event</span>
                  <span>Upcoming</span>
                </h3>
                <button
                  onClick={onOpenAddEventModal}
                  className="text-xs text-[#adc6ff] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Add Event</span>
                </button>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-[#151b2b] p-3 rounded-xl border border-[#424754]/40 flex gap-4 items-center hover:border-white/20 transition-colors"
                  >
                    <div className="bg-[#adc6ff]/20 text-[#adc6ff] w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold flex-shrink-0 border border-[#adc6ff]/30">
                      <span className="text-[10px] uppercase leading-none">{event.month}</span>
                      <span className="text-base leading-tight mt-0.5">{event.day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs text-[#dde2f8] truncate">
                        {event.title}
                      </h4>
                      <p className="text-[11px] text-[#94A3B8]">{event.inDays}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Widget (Bottom Left) matching Image 5 */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
        {/* Chat Bubble Tooltip */}
        {showTooltip && (
          <div
            id="chatbot-tooltip"
            className="glass-panel rounded-2xl rounded-bl-none p-4 w-64 shadow-2xl border border-[#3B82F6]/40 animate-in fade-in slide-in-from-bottom-2 duration-300 relative group"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-[#94A3B8] hover:text-white"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
            <p className="text-xs text-[#dde2f8] leading-relaxed pr-3">
              Need help understanding Recursion? I can break it down for you.
            </p>
            <button
              onClick={() => onOpenGlobalHelper('Explain Recursion base cases and stack unwind with a simple mental model')}
              className="mt-2 text-[11px] font-bold text-[#22D3EE] hover:underline flex items-center gap-1"
            >
              <span>Explain with visual steps</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* FAB Button */}
        <button
          id="btn-fab-study-plan-chat"
          onClick={() => onOpenGlobalHelper()}
          className="w-14 h-14 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-110 active:scale-95 transition-transform duration-200 text-white border border-white/20"
          title="Open AI Tutor"
        >
          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
        </button>
      </div>
    </div>
  );
};
