import React from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card bg-[#151b2b]/95 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#3B82F6]/40 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#22D3EE] text-2xl">
              workspace_premium
            </span>
            <h3 className="font-bold text-lg text-[#dde2f8]">StudyAI Pro</h3>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-[#c2c6d6] leading-relaxed">
            Accelerate your academic performance with unlimited document indexing, deep reasoning mode, and real-time exam prediction.
          </p>

          <div className="space-y-2.5 text-xs">
            {[
              'Unlimited PDF, DOCX, & slide deck uploads',
              'Advanced Multi-Document Cross Analysis',
              'Personalized adaptive flashcards & spaced repetition algorithms',
              'High-priority GPU processing & export to Anki / Notion',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-[#dde2f8]">
                <span className="material-symbols-outlined text-[#22D3EE] text-[18px]">
                  check_circle
                </span>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/10 flex justify-between items-center">
            <div>
              <span className="text-lg font-extrabold text-white">$9.99</span>
              <span className="text-xs text-[#94A3B8]"> / month</span>
            </div>
            <span className="text-[11px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2.5 py-1 rounded-full border border-[#22D3EE]/30">
              Student Discount Applied
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#424754] text-xs font-semibold text-[#c2c6d6]"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              alert('Thank you! StudyAI Pro features unlocked for this preview session.');
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] text-white text-xs font-semibold glow-btn"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};
