import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, SourceRef } from '../types';
import * as chatApi from '../api/chat';
import { ApiError } from '../api/client';

const SUGGESTED_PROMPTS = [
  'Ringkas 3 poin paling penting dari semua materi yang sudah saya upload',
  'Apa topik yang paling sering muncul di materi-materi saya?',
];

export const GeneralChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatApi
      .getGeneralChatHistory()
      .then((history) => {
        const loaded: ChatMessage[] = [];
        history.forEach((entry) => {
          loaded.push({ localId: `h-${entry.id}-q`, sender: 'user', text: entry.question });
          let sources: SourceRef[] = [];
          try {
            sources = JSON.parse(entry.sources);
          } catch {
            sources = [];
          }
          loaded.push({ localId: `h-${entry.id}-a`, sender: 'ai', text: entry.answer, sources });
        });
        setMessages(loaded);
      })
      .catch(() => setError('Gagal memuat riwayat chat.'))
      .finally(() => setIsLoadingHistory(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride ?? inputQuestion;
    if (!text.trim() || isAiThinking) return;

    const userMsg: ChatMessage = { localId: `u-${Date.now()}`, sender: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsAiThinking(true);
    setError(null);

    try {
      const res = await chatApi.askQuestion(text.trim());
      const aiMsg: ChatMessage = { localId: `ai-${Date.now()}`, sender: 'ai', text: res.answer, sources: res.sources };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 503
          ? 'Server AI sedang sibuk. Coba lagi sebentar.'
          : 'Gagal mendapat jawaban. Coba lagi.'
      );
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleClearHistory = async () => {
    if (isClearing || messages.length === 0) return;
    const confirmed = window.confirm('Hapus semua riwayat percakapan "Tanya AI"? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) return;

    setIsClearing(true);
    setError(null);
    try {
      await chatApi.clearGeneralChatHistory();
      setMessages([]);
    } catch {
      setError('Gagal menghapus riwayat, coba lagi.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <main className="flex-1 w-full max-w-[900px] mx-auto px-4 md:px-6 pt-24 pb-6 flex flex-col h-[calc(100vh-20px)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-2xl md:text-3xl text-[#dde2f8] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6] text-3xl">smart_toy</span>
            <span>Tanya AI</span>
          </h1>
          <p className="text-[#c2c6d6] text-sm mt-1">
            Tanya apa saja — AI otomatis mencari jawaban dari semua dokumen yang sudah kamu upload, tanpa perlu pilih dokumen dulu.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={isClearing}
            title="Bersihkan riwayat percakapan"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 border border-white/10 hover:border-[#ffb4ab]/30 px-3 py-2 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span className="hidden sm:inline">{isClearing ? 'Menghapus...' : 'Bersihkan Riwayat'}</span>
          </button>
        )}
      </div>

      <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoadingHistory && <p className="text-xs text-[#94A3B8] text-center">Memuat riwayat chat...</p>}

          {!isLoadingHistory && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
              <div className="w-14 h-14 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#adc6ff] text-2xl">smart_toy</span>
              </div>
              <div>
                <p className="text-sm text-[#dde2f8] font-medium">Belum ada percakapan.</p>
                <p className="text-xs text-[#94A3B8] mt-1">Coba salah satu pertanyaan di bawah, atau ketik sendiri.</p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-md">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#c2c6d6] hover:text-[#dde2f8] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div key={msg.localId} className={`flex gap-4 ${isAi ? '' : 'flex-row-reverse'}`}>
                {isAi ? (
                  <div className="w-10 h-10 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">smart_toy</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#33394a] flex items-center justify-center flex-shrink-0 border border-white/10">
                    <span className="material-symbols-outlined text-[#c2c6d6] text-[20px]">person</span>
                  </div>
                )}
                <div className={`flex-1 ${isAi ? '' : 'flex justify-end'}`}>
                  <div
                    className={`p-4 rounded-2xl max-w-2xl inline-block relative ${
                      isAi
                        ? 'glass-panel rounded-tl-sm border-l-2 border-l-[#adc6ff] text-[#dde2f8]'
                        : 'bg-[#33394a] rounded-tr-sm border border-white/10 text-[#dde2f8]'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {isAiThinking && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">smart_toy</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl rounded-tl-sm border-l-2 border-l-[#adc6ff] text-xs text-[#adc6ff] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>AI sedang mencari di semua materi kamu...</span>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-[#ffb4ab] text-center">{error}</p>}

          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-[#0d1322]/70 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Tanya apa saja tentang materi kamu..."
                className="w-full bg-[#242a3a] border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-[#dde2f8] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] transition-all text-sm shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isAiThinking}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#005ac2] transition-colors glow-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-[#94A3B8]">AI bisa saja keliru. Selalu verifikasi ke dokumen sumber.</span>
          </div>
        </div>
      </div>
    </main>
  );
};