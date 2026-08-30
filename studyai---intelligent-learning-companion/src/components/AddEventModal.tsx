import React, { useState } from 'react';
import { UpcomingEvent } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: UpcomingEvent) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('Nov');
  const [day, setDay] = useState('04');
  const [inDays, setInDays] = useState('In 14 days');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      id: `ev-${Date.now()}`,
      month,
      day,
      title: title.trim(),
      inDays,
      type: 'exam',
    });
    onClose();
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card bg-[#151b2b]/95 rounded-3xl p-6 md:p-8 max-w-md w-full border border-white/15 shadow-2xl space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <h3 className="font-bold text-lg text-[#dde2f8]">Add Exam or Milestone</h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
              Exam / Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Operating Systems Final Exam"
              className="input-glass w-full rounded-xl py-3 px-4 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-[#242a3a] border border-white/10 rounded-xl p-3 text-xs text-white"
              >
                {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                Day
              </label>
              <input
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="e.g. 24"
                className="input-glass w-full rounded-xl py-3 px-4 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
              Countdown Notice
            </label>
            <input
              type="text"
              value={inDays}
              onChange={(e) => setInDays(e.target.value)}
              placeholder="e.g. In 14 days"
              className="input-glass w-full rounded-xl py-3 px-4 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#424754] text-[#c2c6d6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] text-white font-semibold glow-btn"
            >
              Add to Study Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
