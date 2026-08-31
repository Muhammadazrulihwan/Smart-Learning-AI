import React, { useEffect, useRef, useState } from 'react';
import { DocumentItem, ChatMessage, QuizQuestion, SourceRef } from '../types';
import * as chatApi from '../api/chat';
import * as quizApi from '../api/quiz';
import { ApiError } from '../api/client';

interface DocumentDetailViewProps {
  document: DocumentItem;
  onBack: () => void;
  onLogout: () => void;
}

function fileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'docx') return 'menu_book';
  if (ext === 'txt') return 'article';
  return 'description';
}

export const DocumentDetailView: React.FC<DocumentDetailViewProps> = ({ document, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat');

  // ==== Chat state ====
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ==== Quiz state ====
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation: string | null } | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Topik yang pernah muncul di quiz dokumen ini (data asli, bukan "extracted topics" palsu)
  const knownTopics = Array.from(new Set(quizQuestions.map((q) => q.topic).filter((t): t is string => !!t)));

  useEffect(() => {
    // load riwayat chat
    chatApi
      .getChatHistory(document.id)
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
      .catch(() => setChatError('Gagal memuat riwayat chat.'))
      .finally(() => setIsLoadingHistory(false));

    // load quiz yang sudah pernah dibuat untuk dokumen ini
    quizApi
      .listQuizzesForDocument(document.id)
      .then(setQuizQuestions)
      .catch(() => setQuizQuestions([]))
      .finally(() => setIsLoadingQuiz(false));
  }, [document.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend ?? inputQuestion;
    if (!text.trim() || isAiThinking) return;

    const userMsg: ChatMessage = { localId: `u-${Date.now()}`, sender: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsAiThinking(true);
    setChatError(null);

    try {
      const res = await chatApi.askQuestion(text.trim(), document.id);
      const aiMsg: ChatMessage = { localId: `ai-${Date.now()}`, sender: 'ai', text: res.answer, sources: res.sources };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 503
          ? 'Server AI sedang sibuk. Coba lagi sebentar.'
          : 'Gagal mendapat jawaban. Coba lagi.';
      setChatError(msg);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setQuizError(null);
    try {
      const questions = await quizApi.generateQuiz(document.id, 5);
      setQuizQuestions(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setSubmitResult(null);
      setQuizScore(0);
      setQuizFinished(false);
    } catch (err) {
      setQuizError(err instanceof ApiError ? err.message : 'Gagal membuat kuis, coba lagi.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectAnswer = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsSubmittingAnswer(true);
    setQuizError(null);
    try {
      const currentQ = quizQuestions[currentQuestionIndex];
      const result = await quizApi.submitQuizAnswer(currentQ.id, selectedAnswer);
      setSubmitResult({ isCorrect: result.is_correct, correctAnswer: result.correct_answer, explanation: result.explanation });
      setIsAnswerSubmitted(true);
      if (result.is_correct) setQuizScore((prev) => prev + 1);
    } catch (err) {
      setQuizError('Gagal submit jawaban, coba lagi.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setSubmitResult(null);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-[#0d1322]/90 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-6 md:gap-8">
          <button onClick={onBack} className="font-extrabold text-[28px] tracking-tight text-[#adc6ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6]">psychology</span>
            <span>StudyAI</span>
          </button>
          <div className="flex items-center space-x-4 pl-6 border-l border-white/10 h-10">
            <button onClick={onBack} className="text-[#c2c6d6] font-medium hover:text-[#adc6ff] transition-colors flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <span className="font-bold text-base text-[#dde2f8] block">{document.original_name}</span>
            <span className="block text-[12px] text-[#94A3B8] -mt-0.5">{document.chunk_count} chunk terindeks</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10 mx-2 hidden md:block"></div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all text-xs font-semibold text-[#dde2f8]"
          >
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1600px] mx-auto pt-24 pb-8 px-4 md:px-8 flex flex-col md:flex-row gap-6 h-[calc(100vh-20px)] overflow-hidden">
        {/* Left Column: Info Dokumen */}
        <div className="hidden lg:flex w-1/4 glass-panel rounded-2xl flex-col h-full border border-white/10 overflow-hidden">
          <div className="p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#2f3445] text-[#adc6ff] border border-white/5">
                <span className="material-symbols-outlined text-[28px]">{fileIcon(document.original_name)}</span>
              </div>
              <div>
                <h2 className="font-bold text-base text-[#dde2f8] leading-tight">{document.original_name}</h2>
                <p className="text-[#94A3B8] text-xs mt-0.5">{document.chunk_count} chunk</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2.5">Topik dari Kuis</h3>
                {knownTopics.length === 0 ? (
                  <p className="text-xs text-[#94A3B8]">Belum ada. Generate kuis untuk melihat topik yang terdeteksi.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {knownTopics.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-lg text-xs border bg-white/5 text-[#c2c6d6] border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2">Prompt Cepat</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSendMessage('Buatkan 3 poin ringkasan konsep paling penting dari dokumen ini.')}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#adc6ff] border border-white/5 transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span>3 poin kunci untuk ujian</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat & Quiz */}
        <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
          <div className="flex space-x-2 mb-4 bg-[#242a3a] p-1.5 rounded-xl w-fit self-center lg:self-start border border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'chat' ? 'bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30' : 'text-[#c2c6d6] hover:text-[#dde2f8] hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              <span>Chat Q&A</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'quiz' ? 'bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30' : 'text-[#c2c6d6] hover:text-[#dde2f8] hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">quiz</span>
              <span>Kuis</span>
            </button>
          </div>

          {/* Tab Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingHistory && <p className="text-xs text-[#94A3B8] text-center">Memuat riwayat chat...</p>}

                {!isLoadingHistory && messages.length === 0 && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">smart_toy</span>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl rounded-tl-sm border-l-2 border-l-[#adc6ff] max-w-3xl text-sm text-[#dde2f8]">
                      Halo! Saya sudah membaca "{document.original_name}". Silakan tanya apa saja seputar isi dokumen ini.
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
                          className={`p-4 rounded-2xl max-w-3xl inline-block relative ${
                            isAi
                              ? 'glass-panel rounded-tl-sm border-l-2 border-l-[#adc6ff] text-[#dde2f8]'
                              : 'bg-[#33394a] rounded-tr-sm border border-white/10 text-[#dde2f8]'
                          }`}
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-line">{msg.text}
                            </div>
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
                      <span>AI sedang mengambil bagian relevan & menyusun jawaban...</span>
                    </div>
                  </div>
                )}

                {chatError && <p className="text-xs text-[#ffb4ab] text-center">{chatError}</p>}

                <div ref={chatBottomRef} />
              </div>

              <div className="p-4 border-t border-white/10 bg-[#0d1322]/70 backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative max-w-4xl mx-auto flex items-center gap-3"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputQuestion}
                      onChange={(e) => setInputQuestion(e.target.value)}
                      placeholder="Tanyakan sesuatu tentang dokumen ini..."
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
          )}

          {/* Tab Quiz */}
          {activeTab === 'quiz' && (
            <div className="flex-1 glass-panel rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col overflow-y-auto">
              {isLoadingQuiz && <p className="text-xs text-[#94A3B8] text-center">Memuat kuis...</p>}

              {!isLoadingQuiz && quizQuestions.length === 0 && !isGeneratingQuiz && (
                <div className="m-auto text-center space-y-4">
                  <span className="material-symbols-outlined text-5xl text-[#94A3B8]">quiz</span>
                  <p className="text-sm text-[#c2c6d6]">Belum ada kuis untuk dokumen ini.</p>
                  <button
                    onClick={handleGenerateQuiz}
                    className="bg-[#3B82F6] hover:bg-[#005ac2] text-white font-semibold px-6 py-2.5 rounded-xl glow-btn transition-all text-sm"
                  >
                    Generate Kuis
                  </button>
                  {quizError && <p className="text-xs text-[#ffb4ab]">{quizError}</p>}
                </div>
              )}

              {isGeneratingQuiz && (
                <div className="m-auto text-center space-y-4">
                  <span className="material-symbols-outlined text-4xl text-[#22D3EE] animate-spin">sync</span>
                  <p className="text-sm text-[#c2c6d6]">Sedang membuat soal dari dokumen kamu...</p>
                </div>
              )}

              {!isLoadingQuiz && quizQuestions.length > 0 && !isGeneratingQuiz && !quizFinished && (
                <div className="max-w-3xl mx-auto w-full space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs uppercase font-bold text-[#22D3EE] tracking-wider">Uji Pemahaman</span>
                      <h3 className="font-bold text-lg text-[#dde2f8] mt-0.5">
                        Soal {currentQuestionIndex + 1} dari {quizQuestions.length}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#94A3B8]">
                        Skor: <strong className="text-[#adc6ff]">{quizScore}</strong>
                      </span>
                      <button
                        onClick={handleGenerateQuiz}
                        title="Generate kuis baru"
                        className="text-[#94A3B8] hover:text-[#adc6ff] p-1.5 rounded-lg hover:bg-white/5"
                      >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#242a3a] p-5 rounded-2xl border border-white/5">
                    <p className="text-base md:text-lg font-semibold text-[#dde2f8] leading-relaxed">
                      {quizQuestions[currentQuestionIndex].question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(quizQuestions[currentQuestionIndex].options || []).map((option, idx) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrectOption = isAnswerSubmitted && submitResult && option === submitResult.correctAnswer;
                      const isWrongSelected = isAnswerSubmitted && isSelected && submitResult && !submitResult.isCorrect;

                      let btnStyle = 'bg-white/5 border-white/10 hover:border-white/30 text-[#dde2f8]';
                      if (isAnswerSubmitted) {
                        if (isCorrectOption) btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                        else if (isWrongSelected) btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-[#3B82F6]/20 border-[#3B82F6] text-white shadow-md';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(option)}
                          disabled={isAnswerSubmitted}
                          className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswerSubmitted && submitResult && (
                    <div className="p-4 rounded-xl bg-[#151b2b] border border-white/10 space-y-2 animate-fade-in">
                      <div className={`flex items-center gap-2 text-xs font-bold ${submitResult.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {submitResult.isCorrect ? 'check_circle' : 'cancel'}
                        </span>
                        <span>{submitResult.isCorrect ? 'Benar!' : 'Kurang tepat'}</span>
                      </div>
                      {submitResult.explanation && <p className="text-xs text-[#c2c6d6] leading-relaxed">{submitResult.explanation}</p>}
                    </div>
                  )}

                  {quizError && <p className="text-xs text-[#ffb4ab]">{quizError}</p>}

                  <div className="flex justify-end pt-4">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null || isSubmittingAnswer}
                        className="bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-xl glow-btn transition-all text-sm"
                      >
                        {isSubmittingAnswer ? 'Mengirim...' : 'Submit Jawaban'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-[#3B82F6] hover:bg-[#005ac2] text-white font-semibold px-6 py-2.5 rounded-xl glow-btn transition-all text-sm flex items-center gap-2"
                      >
                        <span>{currentQuestionIndex + 1 < quizQuestions.length ? 'Soal Berikutnya' : 'Lihat Hasil'}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {quizFinished && (
                <div className="max-w-md mx-auto my-auto text-center p-8 glass-panel rounded-3xl border border-white/10 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center mx-auto text-[#22D3EE]">
                    <span className="material-symbols-outlined text-4xl">emoji_events</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl text-[#dde2f8]">Kuis Selesai!</h3>
                    <p className="text-sm text-[#c2c6d6] mt-1">
                      Skor kamu {quizScore} dari {quizQuestions.length} di "{document.original_name}".
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleGenerateQuiz}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/5 text-[#dde2f8]"
                    >
                      Kuis Baru
                    </button>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="flex-1 py-2.5 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold hover:bg-[#005ac2] glow-btn"
                    >
                      Review via Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
