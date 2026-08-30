import React, { useState } from 'react';
import { DocumentItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('Extracting document content...');

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleStartProcessing = () => {
    if (!docTitle.trim()) return;

    setIsProcessing(true);
    setProcessingProgress(20);
    setProcessingStep('Extracting semantic chapters and text chunks...');

    setTimeout(() => {
      setProcessingProgress(55);
      setProcessingStep('Generating AI vector embeddings & concept taxonomy...');
    }, 600);

    setTimeout(() => {
      setProcessingProgress(85);
      setProcessingStep('Synthesizing study summary & generating practice questions...');
    }, 1200);

    setTimeout(() => {
      setProcessingProgress(100);
      setProcessingStep('Complete! Ready for study.');

      const fileExtension = selectedFile?.name.split('.').pop()?.toUpperCase() || 'PDF';
      const fileType = (['PDF', 'DOCX', 'TXT', 'PPTX'].includes(fileExtension)
        ? fileExtension
        : 'PDF') as 'PDF' | 'DOCX' | 'TXT' | 'PPTX';

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: docTitle.trim(),
        fileType,
        timeAgo: 'Just now',
        status: 'processed',
        pages: Math.floor(Math.random() * 30) + 12,
        parsedAtText: 'Parsed Just now',
        topics: ['Core Foundations', 'Key Definitions', 'Asymptotic Bounds', 'Implementation Cases'],
        summary: `Parsed and indexed material for "${docTitle}". Comprehensive conceptual overview generated with practice flashcards and citation markers ready for exploration.`,
        iconType: fileType === 'DOCX' ? 'menu_book' : fileType === 'TXT' ? 'article' : 'description',
        chunks: [
          {
            id: `chk-${Date.now()}-1`,
            page: 1,
            chunk: 1,
            text: `Overview section of ${docTitle}. Introduces primary problem statements and formal assumptions.`,
          },
          {
            id: `chk-${Date.now()}-2`,
            page: 5,
            chunk: 2,
            text: `Analysis and algorithmic proofs establishing theoretical efficiency guarantees and practical edge cases.`,
          },
        ],
      };

      setTimeout(() => {
        onUploadSuccess(newDoc);
        onClose();
        setIsProcessing(false);
        setProcessingProgress(0);
        setSelectedFile(null);
        setDocTitle('');
      }, 400);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card bg-[#151b2b]/95 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-white/15 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6] text-2xl">
              upload_file
            </span>
            <h3 className="font-bold text-lg text-[#dde2f8]">Upload Study Material</h3>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-white p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {!isProcessing ? (
          <div className="space-y-5">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                  : 'border-[#424754]/60 hover:border-[#adc6ff]/50 bg-white/[0.02]'
              }`}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.docx,.txt,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block">
                <div className="w-14 h-14 rounded-full bg-[#191f2f] flex items-center justify-center mx-auto mb-3 text-[#adc6ff] border border-white/10">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <p className="font-semibold text-sm text-[#dde2f8]">
                  {selectedFile ? selectedFile.name : 'Click to browse or drag file here'}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Supports PDF, Word (DOCX), Text files (TXT) up to 50MB
                </p>
              </label>
            </div>

            {/* Title field */}
            <div>
              <label className="block text-xs font-semibold text-[#c2c6d6] mb-2 uppercase tracking-wider">
                Document Title / Subject
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Operating Systems Chapter 3 - Concurrency"
                className="input-glass w-full rounded-xl py-3 px-4 text-sm font-medium text-white placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="flex gap-2 text-xs">
              <span className="text-[#94A3B8] self-center">Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setDocTitle('Computer Networks - TCP vs UDP Protocols');
                  setSelectedFile(new File([''], 'Networks.pdf'));
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#adc6ff] border border-white/5"
              >
                Networks PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocTitle('Linear Algebra - Eigenvalues & Matrix Transformations');
                  setSelectedFile(new File([''], 'LinAlg.docx'));
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#22D3EE] border border-white/5"
              >
                LinAlg DOCX
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#424754] text-xs font-semibold text-[#c2c6d6] hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartProcessing}
                disabled={!docTitle.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold glow-btn transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                Process with AI
              </button>
            </div>
          </div>
        ) : (
          /* Processing State */
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center mx-auto text-[#22D3EE] animate-pulse">
              <span className="material-symbols-outlined text-3xl animate-spin">
                sync
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-[#dde2f8]">
                Analyzing & Parsing Material
              </h4>
              <p className="text-xs text-[#22D3EE] mt-1 font-mono">{processingStep}</p>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              <div className="w-full bg-[#0d1322] h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-[#3B82F6] h-full transition-all duration-500 rounded-full progress-glow"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                {processingProgress}% Complete
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
