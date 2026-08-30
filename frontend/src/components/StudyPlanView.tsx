import React, { useEffect, useState } from 'react';
import { StudyPlanItem } from '../types';
import * as studyPlanApi from '../api/studyPlan';

interface StudyPlanViewProps {
  onNavigateHome: () => void;
}

const priorityStyle = (priority: number) => {
  // priority 1 = paling lemah (dari backend, urutan sudah terurut akurasi terendah -> tertinggi)
  if (priority === 1) return { bar: 'bg-red-500', badge: 'bg-red-500/20 text-red-400', label: 'PRIORITAS 1', icon: 'warning', iconColor: 'text-red-400' };
  if (priority === 2) return { bar: 'bg-yellow-500', badge: 'bg-yellow-500/20 text-yellow-500', label: `PRIORITAS ${priority}`, icon: 'lightbulb', iconColor: 'text-yellow-500' };
  return { bar: 'bg-green-500', badge: 'bg-green-500/20 text-green-500', label: `PRIORITAS ${priority}`, icon: 'check_circle', iconColor: 'text-green-500' };
};

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ onNavigateHome }) => {
  const [topics, setTopics] = useState<StudyPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studyPlanApi
      .getStudyPlan()
      .then(setTopics)
      .catch(() => setError('Gagal memuat rekomendasi belajar.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-[1280px] mx-auto w-full flex flex-col">
      <header className="mb-10">
        <h1 className="font-extrabold text-3xl md:text-4xl text-[#dde2f8] mb-2">Study Plan Personal</h1>
        <p className="text-[#c2c6d6]">
          Rekomendasi belajar dari AI, disusun otomatis berdasarkan hasil kuis kamu di seluruh dokumen.
        </p>
      </header>

      {isLoading && <p className="text-sm text-[#94A3B8]">Memuat rekomendasi...</p>}
      {error && <p className="text-sm text-[#ffb4ab]">{error}</p>}

      {!isLoading && !error && topics.length === 0 && (
        <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-[#424754]">
          <div className="w-20 h-20 bg-[#2f3445] rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-[#c2c6d6]">assignment</span>
          </div>
          <h3 className="font-bold text-xl text-[#dde2f8] mb-2">Belum Ada Rencana Belajar</h3>
          <p className="text-[#c2c6d6] mb-6 max-w-md text-sm">
            Kerjakan kuis di salah satu dokumen untuk mendapat rekomendasi belajar yang dipersonalisasi.
          </p>
          <button
            onClick={onNavigateHome}
            className="bg-[#3B82F6] text-white font-semibold px-6 py-3 rounded-lg glow-btn"
          >
            Kembali ke Dashboard
          </button>
        </div>
      )}

      {!isLoading && topics.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 flex flex-col gap-6">
            {topics.map((item) => {
              const style = priorityStyle(item.priority);
              return (
                <article
                  key={item.topic}
                  className="glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${style.bar}`}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`${style.badge} px-2 py-1 rounded-md text-xs uppercase tracking-wider font-bold`}>
                          {style.label}
                        </span>
                        <h3 className="font-bold text-xl text-[#dde2f8]">{item.topic}</h3>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined ${style.iconColor}`}>{style.icon}</span>
                  </div>

                  {item.recommendation && (
                    <div className="bg-[#151b2b] p-4 rounded-xl border border-white/10 flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#4cd7f6] mt-1">psychology</span>
                      <div>
                        <p className="text-[#dde2f8] font-medium mb-1 text-sm">Rekomendasi AI</p>
                        <p className="text-[#c2c6d6] text-sm">{item.recommendation}</p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="xl:col-span-1 flex flex-col gap-8">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-bold text-lg text-[#dde2f8] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff]">trending_up</span> Ringkasan
              </h3>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-[#c2c6d6]">Topik untuk direview</span>
                <span className="text-xl font-bold text-[#dde2f8]">{topics.length}</span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-2">
                Rekomendasi ini otomatis diperbarui setiap kamu selesai mengerjakan kuis baru.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
