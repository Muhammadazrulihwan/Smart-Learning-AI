import React, { useState } from 'react';
import { StudyTopic, QuizQuestion } from '../types';
import { SAMPLE_QUIZZES } from '../data/mockData';

interface QuizModalProps {
  topic: StudyTopic | null;
  isOpen: boolean;
  onClose: () => void;
  onMasteryUpdated: (topicId: string, newMastery: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  topic,
  isOpen,
  onClose,
  onMasteryUpdated,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen || !topic) return null;

  const questions: QuizQuestion[] =
    SAMPLE_QUIZZES[topic.title] ||
    SAMPLE_QUIZZES['Data Structures 101'] ||
    [];

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);
    if (selectedOpt === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setIsDone(true);
      const newMastery = Math.min(100, topic.mastery + 20);
      onMasteryUpdated(topic.id, newMastery);
    }
  };

  const handleClose = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setIsDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card bg-[#151b2b]/95 rounded-3xl p-6 md:p-8 max-w-xl w-full border border-white/15 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#3B82F6]/20 text-[#22D3EE] border border-[#3B82F6]/30">
                Priority {topic.priority} Focus
              </span>
              <span className="text-xs text-[#94A3B8]">• {topic.documentSource}</span>
            </div>
            <h3 className="font-bold text-xl text-[#dde2f8] mt-1">
              {topic.title} Mastery Session
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-[#94A3B8] hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {!isDone ? (
          <div className="space-y-5">
            {/* Progress */}
            <div className="flex justify-between items-center text-xs text-[#94A3B8]">
              <span>
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span>Score: {score}</span>
            </div>

            {/* Question */}
            <div className="p-4 rounded-xl bg-[#242a3a] border border-white/5 font-semibold text-sm text-[#dde2f8] leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOpt === i;
                const isCorrect = i === currentQ.correctIndex;

                let style = 'bg-white/5 border-white/10 hover:border-white/20 text-[#dde2f8]';
                if (submitted) {
                  if (isCorrect) {
                    style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  style = 'bg-[#3B82F6]/25 border-[#3B82F6] text-white';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 ${style}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <div className="p-3.5 rounded-xl bg-[#0d1322] border border-white/10 text-xs space-y-1 animate-in fade-in duration-200">
                <span className="font-bold text-[#adc6ff] block">AI Concept Insight:</span>
                <p className="text-[#c2c6d6] leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOpt === null}
                  className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-40 text-white text-xs font-semibold glow-btn"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] text-white text-xs font-semibold glow-btn flex items-center gap-1.5"
                >
                  <span>{currentIdx + 1 < questions.length ? 'Next' : 'Finish Session'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished State */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <div>
              <h4 className="font-extrabold text-xl text-[#dde2f8]">Session Complete!</h4>
              <p className="text-xs text-[#c2c6d6] mt-1">
                You gained +20% mastery on <strong className="text-white">{topic.title}</strong>.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] text-white text-xs font-semibold glow-btn"
            >
              Back to Study Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
