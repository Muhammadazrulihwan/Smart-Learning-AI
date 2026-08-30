import React from 'react';
import { DocumentItem } from '../types';

interface DashboardViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenUpload: () => void;
  onNavigateToStudyPlan: (topicTitle?: string) => void;
  onOpenGlobalChat: () => void;
  searchQuery: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
  onNavigateToStudyPlan,
  onOpenGlobalChat,
  searchQuery,
}) => {
  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.fileType.toLowerCase().includes(q) ||
      doc.topics.some((t) => t.toLowerCase().includes(q)) ||
      doc.summary.toLowerCase().includes(q)
    );
  });

  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-12 py-28 md:py-32 flex flex-col gap-10 relative">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-extrabold text-3xl md:text-4xl text-[#dde2f8] tracking-tight">
            My Documents
          </h1>
          <p className="text-[#c2c6d6] text-base mt-2">
            Manage your uploaded materials and track processing status.
          </p>
        </div>
        <button
          id="btn-upload-document-main"
          onClick={onOpenUpload}
          className="bg-[#3B82F6] hover:bg-[#005ac2] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 glow-btn transition-all active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            upload_file
          </span>
          <span>Upload New Document</span>
        </button>
      </header>

      {/* Main Content Area: Bento grid + Study Plan Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Grid (Bento style) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => {
            const isProcessing = doc.status === 'processing';
            const iconColor =
              doc.id === 'doc-algo'
                ? 'text-[#4cd7f6]'
                : doc.id === 'doc-micro'
                ? 'text-[#22D3EE]'
                : doc.id === 'doc-history'
                ? 'text-[#d0bcff]'
                : 'text-[#adc6ff]';

            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between h-64 group relative overflow-hidden transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/25 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#adc6ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="flex justify-between items-start z-10">
                  <div className="bg-[#191f2f] p-3 rounded-xl border border-[#424754]/50 shadow-inner">
                    <span className={`material-symbols-outlined ${iconColor} text-3xl`}>
                      {doc.iconType || 'description'}
                    </span>
                  </div>

                  {isProcessing ? (
                    <span className="bg-[#242a3a] text-[#c2c6d6] border border-[#424754] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[14px] animate-spin text-[#22D3EE]">
                        sync
                      </span>
                      <span>Processing</span>
                    </span>
                  ) : (
                    <span className="bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-pulse"></span>
                      <span>Processed</span>
                    </span>
                  )}
                </div>

                <div className="z-10 mt-auto">
                  <h3 className="font-bold text-xl text-[#dde2f8] mb-2 line-clamp-2 group-hover:text-[#adc6ff] transition-colors leading-snug">
                    {doc.title}
                  </h3>

                  <div className="flex items-center gap-4 text-[#c2c6d6] text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">
                        schedule
                      </span>
                      <span>{doc.timeAgo}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">
                        insert_drive_file
                      </span>
                      <span>{doc.fileType}</span>
                    </span>
                    {doc.pages && (
                      <span className="text-[#94A3B8]">• {doc.pages} Pages</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State / Add New Card */}
          <div
            onClick={onOpenUpload}
            className="border-2 border-dashed border-[#424754]/60 rounded-2xl p-6 flex flex-col justify-center items-center h-64 hover:border-[#adc6ff]/60 hover:bg-white/[0.04] transition-all cursor-pointer group text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#191f2f] flex items-center justify-center mb-4 group-hover:bg-[#adc6ff]/15 group-hover:scale-110 transition-all border border-white/5">
              <span className="material-symbols-outlined text-[#c2c6d6] text-3xl group-hover:text-[#adc6ff] transition-colors">
                add
              </span>
            </div>
            <span className="font-semibold text-sm text-[#c2c6d6] group-hover:text-white transition-colors">
              Drag & Drop or Click to Upload
            </span>
            <span className="text-[11px] text-[#94A3B8] mt-1">
              Supports PDF, DOCX, TXT (Max 50MB)
            </span>
          </div>
        </div>

        {/* Study Plan Summary Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 sticky top-28 border border-white/10">
            <h2 className="font-bold text-xl text-[#dde2f8] flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#22D3EE]">model_training</span>
              <span>Study Plan Focus</span>
            </h2>

            <div className="space-y-4">
              {/* Recommendation 1: Priority */}
              <div
                onClick={() => onNavigateToStudyPlan("Dijkstra's Algorithm Implementation")}
                className="bg-[#242a3a] rounded-xl p-4 border border-[#424754]/40 hover:border-[#22D3EE]/60 transition-all cursor-pointer group hover:bg-[#2f3445]"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider">
                    Priority
                  </span>
                  <span className="material-symbols-outlined text-[#c2c6d6] group-hover:text-[#22D3EE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-sm">
                    arrow_outward
                  </span>
                </div>
                <h4 className="font-semibold text-[#dde2f8] text-sm mb-1 group-hover:text-[#22D3EE] transition-colors">
                  Dijkstra's Algorithm Implementation
                </h4>
                <p className="text-xs text-[#c2c6d6] leading-relaxed line-clamp-2">
                  Review the Python code examples from 'Introduction to Algorithms' to prepare for the upcoming quiz.
                </p>
                <div className="mt-3 w-full bg-[#0d1322] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#22D3EE] h-full rounded-full w-3/4 relative glow-cyan-box">
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/50 blur-[2px]"></div>
                  </div>
                </div>
              </div>

              {/* Recommendation 2: Suggested */}
              <div
                onClick={() => onNavigateToStudyPlan("Supply and Demand Curves")}
                className="bg-[#242a3a] rounded-xl p-4 border border-[#424754]/40 hover:border-[#adc6ff]/60 transition-all cursor-pointer group hover:bg-[#2f3445]"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-[#adc6ff] uppercase tracking-wider">
                    Suggested
                  </span>
                  <span className="material-symbols-outlined text-[#c2c6d6] group-hover:text-[#adc6ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-sm">
                    arrow_outward
                  </span>
                </div>
                <h4 className="font-semibold text-[#dde2f8] text-sm mb-1 group-hover:text-[#adc6ff] transition-colors">
                  Supply and Demand Curves
                </h4>
                <p className="text-xs text-[#c2c6d6] leading-relaxed line-clamp-2">
                  Generate flashcards from 'Microeconomics Notes' focusing on elasticity.
                </p>
              </div>
            </div>

            <button
              id="btn-view-full-plan"
              onClick={() => onNavigateToStudyPlan()}
              className="w-full mt-6 py-3 border border-[#424754] rounded-xl font-semibold text-sm text-[#dde2f8] hover:bg-white/10 hover:border-[#adc6ff]/50 transition-all"
            >
              View Full Plan
            </button>
          </div>
        </aside>
      </div>

      {/* Floating Chatbot Widget (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <div
          id="btn-floating-ask-ai"
          onClick={onOpenGlobalChat}
          className="glass-card p-4 rounded-2xl rounded-bl-none shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-white/[0.08] transition-all border border-[#3B82F6]/40 hover:scale-105 active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center relative border border-[#3B82F6]/40">
            <span className="material-symbols-outlined text-[#3B82F6] text-xl group-hover:rotate-12 transition-transform">
              smart_toy
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#4cd7f6] rounded-full border-2 border-[#0d1322]"></span>
          </div>
          <div>
            <p className="font-semibold text-sm text-[#dde2f8] group-hover:text-[#adc6ff] transition-colors">
              Ask AI about your materials
            </p>
            <p className="text-xs text-[#94A3B8]">Ready to answer questions</p>
          </div>
        </div>
      </div>
    </main>
  );
};
