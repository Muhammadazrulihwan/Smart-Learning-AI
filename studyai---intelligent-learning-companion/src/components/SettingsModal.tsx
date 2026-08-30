import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [tutorPersona, setTutorPersona] = useState('socratic');
  const [citationStrictness, setCitationStrictness] = useState('high');
  const [glowEffects, setGlowEffects] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card bg-[#151b2b]/95 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-white/15 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6] text-2xl">settings</span>
            <h3 className="font-bold text-lg text-[#dde2f8]">StudyAI Settings & Preferences</h3>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 rounded-lg">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-5 text-xs">
          <div>
            <label className="block font-bold text-[#c2c6d6] mb-2 uppercase tracking-wider">
              AI Tutor Interaction Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'socratic', label: 'Socratic Guiding', desc: 'Questions & clues' },
                { id: 'direct', label: 'Direct Summary', desc: 'Concise answers' },
                { id: 'code', label: 'Code & Math', desc: 'Algorithmic focus' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTutorPersona(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tutorPersona === m.id
                      ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-[#c2c6d6] hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-xs">{m.label}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#c2c6d6] mb-2 uppercase tracking-wider">
              Citation Verification Level
            </label>
            <select
              value={citationStrictness}
              onChange={(e) => setCitationStrictness(e.target.value)}
              className="w-full bg-[#242a3a] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="high">Strict - Exact Page & Chunk references required</option>
              <option value="balanced">Balanced - Concept level with excerpts</option>
              <option value="relaxed">Relaxed - Open conversational exploration</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <span className="font-bold text-white block">Intelligent Futurism Glow</span>
              <span className="text-[11px] text-[#94A3B8]">Electric cyan & blue ambiance lighting</span>
            </div>
            <input
              type="checkbox"
              checked={glowEffects}
              onChange={(e) => setGlowEffects(e.target.checked)}
              className="rounded bg-black/40 border-white/20 text-[#3B82F6] focus:ring-0 w-4 h-4"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] text-white text-xs font-semibold glow-btn"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
