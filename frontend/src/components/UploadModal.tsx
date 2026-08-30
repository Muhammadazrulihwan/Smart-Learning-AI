import React, { useState } from 'react';
import { DocumentItem } from '../types';
import * as documentsApi from '../api/documents';
import { ApiError } from '../api/client';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentItem) => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateAndSetFile = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMsg(`Format tidak didukung. Gunakan: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setErrorMsg(null);
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const newDoc = await documentsApi.uploadDocument(selectedFile);
      onUploadSuccess(newDoc);
      handleClose();
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : 'Upload gagal, coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-card bg-[#151b2b]/95 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-white/15 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6] text-2xl">upload_file</span>
            <h3 className="font-bold text-lg text-[#dde2f8]">Upload Materi Belajar</h3>
          </div>
          {!isUploading && (
            <button onClick={handleClose} className="text-[#94A3B8] hover:text-white p-1 rounded-lg">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {!isUploading ? (
          <div className="space-y-5">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragActive ? 'border-[#3B82F6] bg-[#3B82F6]/10' : 'border-[#424754]/60 hover:border-[#adc6ff]/50 bg-white/[0.02]'
              }`}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block">
                <div className="w-14 h-14 rounded-full bg-[#191f2f] flex items-center justify-center mx-auto mb-3 text-[#adc6ff] border border-white/10">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <p className="font-semibold text-sm text-[#dde2f8]">
                  {selectedFile ? selectedFile.name : 'Klik untuk pilih atau drag file ke sini'}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">Mendukung PDF, DOCX, TXT</p>
              </label>
            </div>

            {errorMsg && (
              <div className="text-xs text-[#ffb4ab] bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-lg px-3 py-2">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-[#424754] text-xs font-semibold text-[#c2c6d6] hover:bg-white/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile}
                className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold glow-btn transition-all"
              >
                Proses dengan AI
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center mx-auto text-[#22D3EE] animate-pulse">
              <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-[#dde2f8]">Memproses Dokumen</h4>
              <p className="text-xs text-[#22D3EE] mt-1">
                Mengekstrak teks, membuat chunk, dan membangun embedding — ini bisa memakan waktu beberapa detik...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
