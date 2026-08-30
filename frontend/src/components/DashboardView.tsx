import React, { useEffect, useState } from 'react';
import { DocumentItem, StudyPlanItem } from '../types';
import * as studyPlanApi from '../api/studyPlan';

interface DashboardViewProps {
  documents: DocumentItem[];
  isLoadingDocuments: boolean;
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenUpload: () => void;
  onNavigateToStudyPlan: () => void;
}

function fileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'docx') return 'menu_book';
  if (ext === 'txt') return 'article';
  return 'description';
}

const priorityAccent = (priority: number) => {
  if (priority === 1) return { label: 'PRIORITAS', color: 'text-[#22D3EE]', hoverBorder: 'hover:border-[#22D3EE]/60' };
  return { label: 'SARAN', color: 'text-[#adc6ff]', hoverBorder: 'hover:border-[#adc6ff]/60' };
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  isLoadingDocuments,
  onSelectDocument,
  onOpenUpload,
  onNavigateToStudyPlan,
}) => {
  const [studyPlanPreview, setStudyPlanPreview] = useState<StudyPlanItem[]>([]);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    studyPlanApi
      .getStudyPlan()
      .then((plan) => setStudyPlanPreview(plan.slice(0, 2)))
      .catch(() => setStudyPlanPreview([]))
      .finally(() => setIsLoadingPlan(false));
  }, []);

  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-12 py-28 md:py-32 flex flex-col gap-10 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-extrabold text-3xl md:text-4xl text-[#dde2f8] tracking-tight">Dokumen Saya</h1>
          <p className="text-[#c2c6d6] text-base mt-2">Kelola materi yang sudah kamu upload dan pantau status pemrosesannya.</p>
        </div>
        <button
          onClick={onOpenUpload}
          className="bg-[#3B82F6] hover:bg-[#005ac2] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 glow-btn transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            upload_file
          </span>
          <span>Upload Dokumen Baru</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingDocuments && (
            <div className="col-span-2 flex items-center justify-center h-64 text-[#94A3B8] text-sm">
              Memuat dokumen...
            </div>
          )}

          {!isLoadingDocuments &&
            documents.map((doc) => {
              const isProcessing = doc.status === 'pending';
              const isFailed = doc.status === 'failed';

              return (
                <div
                  key={doc.id}
                  onClick={() => !isProcessing && !isFailed && onSelectDocument(doc)}
                  className={`glass-card rounded-2xl p-6 flex flex-col justify-between h-64 group relative overflow-hidden transition-all duration-300 border border-white/10 ${
                    isProcessing || isFailed ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-white/25 hover:shadow-2xl'
                  }`}
                >
                  <div className="flex justify-between items-start z-10">
                    <div className="bg-[#191f2f] p-3 rounded-xl border border-[#424754]/50 shadow-inner">
                      <span className="material-symbols-outlined text-[#adc6ff] text-3xl">
                        {fileIcon(doc.original_name)}
                      </span>
                    </div>

                    {isFailed ? (
                      <span className="bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>Gagal</span>
                      </span>
                    ) : isProcessing ? (
                      <span className="bg-[#242a3a] text-[#c2c6d6] border border-[#424754] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] animate-spin text-[#22D3EE]">sync</span>
                        <span>Memproses</span>
                      </span>
                    ) : (
                      <span className="bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-pulse"></span>
                        <span>Siap</span>
                      </span>
                    )}
                  </div>

                  <div className="z-10 mt-auto">
                    <h3 className="font-bold text-xl text-[#dde2f8] mb-2 line-clamp-2 group-hover:text-[#adc6ff] transition-colors leading-snug">
                      {doc.original_name}
                    </h3>
                    <div className="flex items-center gap-4 text-[#c2c6d6] text-xs font-medium">
                      {doc.chunk_count != null && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">segment</span>
                          <span>{doc.chunk_count} chunk</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          <div
            onClick={onOpenUpload}
            className="border-2 border-dashed border-[#424754]/60 rounded-2xl p-6 flex flex-col justify-center items-center h-64 hover:border-[#adc6ff]/60 hover:bg-white/[0.04] transition-all cursor-pointer group text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#191f2f] flex items-center justify-center mb-4 group-hover:bg-[#adc6ff]/15 group-hover:scale-110 transition-all border border-white/5">
              <span className="material-symbols-outlined text-[#c2c6d6] text-3xl group-hover:text-[#adc6ff] transition-colors">add</span>
            </div>
            <span className="font-semibold text-sm text-[#c2c6d6] group-hover:text-white transition-colors">
              Drag & Drop atau Klik untuk Upload
            </span>
            <span className="text-[11px] text-[#94A3B8] mt-1">Mendukung PDF, DOCX, TXT</span>
          </div>
        </div>

        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 sticky top-28 border border-white/10">
            <h2 className="font-bold text-xl text-[#dde2f8] flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#22D3EE]">model_training</span>
              <span>Fokus Study Plan</span>
            </h2>

            {isLoadingPlan && <p className="text-xs text-[#94A3B8]">Memuat rekomendasi...</p>}

            {!isLoadingPlan && studyPlanPreview.length === 0 && (
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Belum ada rekomendasi. Kerjakan kuis di salah satu dokumen dulu untuk dapat rekomendasi belajar personal.
              </p>
            )}

            <div className="space-y-4">
              {studyPlanPreview.map((item) => {
                const accent = priorityAccent(item.priority);
                return (
                  <div
                    key={item.topic}
                    onClick={onNavigateToStudyPlan}
                    className={`bg-[#242a3a] rounded-xl p-4 border border-[#424754]/40 transition-all cursor-pointer group hover:bg-[#2f3445] ${accent.hoverBorder}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${accent.color}`}>{accent.label}</span>
                      <span className="material-symbols-outlined text-[#c2c6d6] text-sm">arrow_outward</span>
                    </div>
                    <h4 className="font-semibold text-[#dde2f8] text-sm mb-1">{item.topic}</h4>
                    {item.recommendation && (
                      <p className="text-xs text-[#c2c6d6] leading-relaxed line-clamp-2">{item.recommendation}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={onNavigateToStudyPlan}
              className="w-full mt-6 py-3 border border-[#424754] rounded-xl font-semibold text-sm text-[#dde2f8] hover:bg-white/10 hover:border-[#adc6ff]/50 transition-all"
            >
              Lihat Semua Rencana
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};
