import React, { useState, useRef, useEffect } from 'react';
import { DocumentItem, ChatMessage, QuizQuestion } from '../types';
import { USER_STUDENT_AVATAR, SAMPLE_QUIZZES } from '../data/mockData';

interface DocumentDetailViewProps {
  document: DocumentItem;
  onBack: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenGlobalHelper: () => void;
}

export const DocumentDetailView: React.FC<DocumentDetailViewProps> = ({
  document,
  onBack,
  onOpenSettings,
  onLogout,
  onOpenGlobalHelper,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [citationModal, setCitationModal] = useState<{ page: number; chunk: number; text: string } | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I've analyzed "${document.title}". I'm ready to answer any questions you have about ${document.topics.slice(0, 4).join(', ')}, or key concepts. What would you like to explore first?`,
      timestamp: '2h ago',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Can you explain the main difference between an Array and a Linked List in terms of memory allocation?',
      timestamp: '2h ago',
    },
    {
      id: 'm3',
      sender: 'ai',
      text: `Certainly. The primary difference lies in how they use memory:

• **Arrays** require a contiguous block of memory. When you create an array, the system allocates a single, unbroken chunk of memory for all its elements.
• **Linked Lists** use non-contiguous memory. Each element (node) stores its data and a pointer (or link) to the memory address of the next node, allowing elements to be scattered throughout memory.`,
      timestamp: '2h ago',
      sourceCitation: {
        page: 12,
        chunk: 3,
        text: 'Arrays allocate a single contiguous block of memory indexed by offset O(1), while Linked Lists allocate nodes dynamically across arbitrary memory locations connected by memory pointers.'
      }
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    SAMPLE_QUIZZES[document.title] || SAMPLE_QUIZZES['Data Structures 101'] || []
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuestion;
    if (!text.trim() || isAiThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsAiThinking(true);

    setTimeout(() => {
      let aiReply = '';
      let sourceCitation = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('big o') || lower.includes('complexity') || lower.includes('time')) {
        aiReply = `Based on Chapter 1 of "${document.title}":\n\n• **Time Complexity** measures the number of elementary operations as input size $n$ grows.\n• **Space Complexity** evaluates auxiliary memory allocated.\n• **Worst-case analysis** guarantees an upper bound (Big-O), ensuring predictable guarantees under heavy workloads.`;
        sourceCitation = {
          page: 6,
          chunk: 2,
          text: 'Asymptotic analysis models growth rates. Big-O provides a formal upper bound on running time and space requirements.'
        };
      } else if (lower.includes('tree') || lower.includes('avl') || lower.includes('binary')) {
        aiReply = `According to the section on **Binary Search Trees**:\n\n• BST operations take **O(h)** time where $h$ is height.\n• Self-balancing structures like **AVL Trees** use single and double rotations to maintain a height of $O(\\log n)$, preventing worst-case $O(n)$ degradation.`;
        sourceCitation = {
          page: 24,
          chunk: 1,
          text: 'AVL Trees enforce a balance factor between -1 and +1 at every node via automatic left/right sub-tree rotations.'
        };
      } else if (lower.includes('graph') || lower.includes('dijkstra')) {
        aiReply = `Regarding **Graph Algorithms**:\n\n• **Dijkstra's Algorithm** computes the shortest path on weighted graphs with non-negative edges.\n• Using a Min-Heap priority queue, the running time is **O((V + E) log V)**.`;
        sourceCitation = {
          page: 32,
          chunk: 4,
          text: "Dijkstra's greedy choice property continuously extracts the minimum distance unvisited vertex."
        };
      } else {
        aiReply = `Regarding **${document.title}**:\n\nThis material emphasizes applying structured data representations to minimize asymptotic compute overhead. Key takeaways include optimizing access paths, preserving invariants, and balancing memory footprint against traversal speed.`;
        sourceCitation = {
          page: 15,
          chunk: 2,
          text: 'Efficient structure selection directly impacts cache locality, branch prediction, and overall system throughput.'
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: 'Just now',
        sourceCitation,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 1100);
  };

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const currentQ = quizQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-[#adc6ff] selection:text-[#002e6a]">
      {/* Top Bar matching Image 3 HTML */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-[#0d1322]/90 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-6 md:gap-8">
          <button
            onClick={onBack}
            className="font-extrabold text-[28px] tracking-tight text-[#adc6ff] flex items-center gap-2 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[#3B82F6]">psychology</span>
            <span>StudyAI</span>
          </button>

          {/* Contextual Navigation */}
          <div className="flex items-center space-x-4 pl-6 border-l border-white/10 h-10">
            <button
              id="btn-back-to-dashboard"
              onClick={onBack}
              className="text-[#c2c6d6] font-medium hover:text-[#adc6ff] transition-colors flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <span className="font-bold text-base text-[#dde2f8] block">
              {document.title}
            </span>
            <span className="block text-[12px] text-[#94A3B8] -mt-0.5">
              {document.parsedAtText}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-white/10 mx-2 hidden md:block"></div>

          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all text-xs font-semibold text-[#dde2f8]"
          >
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto pt-24 pb-8 px-4 md:px-8 flex flex-col md:flex-row gap-6 h-[calc(100vh-20px)] overflow-hidden">
        {/* Left Column: Document Context */}
        <div className="hidden lg:flex w-1/4 glass-panel rounded-2xl flex-col h-full border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#2f3445] text-[#adc6ff] border border-white/5">
                <span className="material-symbols-outlined text-[28px]">
                  {document.iconType || 'description'}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-base text-[#dde2f8] leading-tight">
                  {document.title}
                </h2>
                <p className="text-[#94A3B8] text-xs mt-0.5">
                  {document.fileType} • {document.pages} Pages
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2.5">
                  Extracted Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTopic(t);
                        handleSendMessage(`Explain the core principles of ${t} from this document with code/pseudocode if applicable.`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-all cursor-pointer ${
                        selectedTopic === t
                          ? 'bg-[#adc6ff]/20 text-[#adc6ff] border-[#adc6ff]/40 shadow-sm'
                          : 'bg-white/5 text-[#c2c6d6] border-white/10 hover:border-[#adc6ff]/40 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2">
                  Summary
                </h3>
                <p className="text-xs text-[#c2c6d6] leading-relaxed">
                  {document.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-bold mb-2">
                  Quick AI Prompts
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSendMessage('Create a 3-bullet summary of the most tested concepts in this document.')}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#adc6ff] border border-white/5 transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span>Top 3 exam key takeaways</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage('Generate a flashcard comparing time vs space complexity for common operations.')}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#22D3EE] border border-white/5 transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">style</span>
                    <span>Generate flashcard breakdown</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 relative flex items-center justify-center opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-[#adc6ff]">
              account_tree
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Area */}
        <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
          {/* Tabs */}
          <div className="flex space-x-2 mb-4 bg-[#242a3a] p-1.5 rounded-xl w-fit self-center lg:self-start border border-white/5 shadow-inner">
            <button
              id="tab-chat-qa"
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30 shadow-md'
                  : 'text-[#c2c6d6] hover:text-[#dde2f8] hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              <span>Chat Q&A</span>
            </button>
            <button
              id="tab-generate-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30 shadow-md'
                  : 'text-[#c2c6d6] hover:text-[#dde2f8] hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">quiz</span>
              <span>Generate Quiz</span>
            </button>
          </div>

          {/* Tab 1: Chat Interface */}
          {activeTab === 'chat' && (
            <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
              {/* Chat History Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => {
                  const isAi = msg.sender === 'ai';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-4 ${isAi ? '' : 'flex-row-reverse'}`}
                    >
                      {isAi ? (
                        <div className="w-10 h-10 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                            smart_toy
                          </span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#33394a] flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/10">
                          <img
                            src={USER_STUDENT_AVATAR}
                            alt="Student avatar"
                            className="w-full h-full object-cover"
                          />
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
                          {isAi && (
                            <div className="absolute inset-0 bg-gradient-to-r from-[#adc6ff]/5 to-transparent pointer-events-none rounded-2xl"></div>
                          )}

                          <div className="text-sm leading-relaxed whitespace-pre-line relative z-10">
                            {msg.text}
                          </div>

                          {/* Source Citation Badge */}
                          {msg.sourceCitation && (
                            <div
                              onClick={() =>
                                setCitationModal({
                                  page: msg.sourceCitation!.page,
                                  chunk: msg.sourceCitation!.chunk,
                                  text: msg.sourceCitation!.text || 'Direct excerpt from indexed material.',
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#03b5d3]/20 border border-[#4cd7f6]/40 mt-3 hover:bg-[#03b5d3]/35 transition-all cursor-pointer shadow-sm group"
                            >
                              <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">
                                find_in_page
                              </span>
                              <span className="text-[11px] font-bold text-[#4cd7f6] uppercase tracking-wider group-hover:underline">
                                Source: Page {msg.sourceCitation.page}, Chunk {msg.sourceCitation.chunk}
                              </span>
                              <span className="material-symbols-outlined text-[12px] text-[#4cd7f6] opacity-60 group-hover:opacity-100">
                                open_in_new
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI Thinking indicator */}
                {isAiThinking && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                        smart_toy
                      </span>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl rounded-tl-sm border-l-2 border-l-[#adc6ff] text-xs text-[#adc6ff] flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm animate-spin">
                        sync
                      </span>
                      <span>Retrieving relevant chunks & generating explanation...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-4 border-t border-white/10 bg-[#0d1322]/70 backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative max-w-4xl mx-auto flex items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Give me 3 flashcard study questions for my next exam.')}
                    title="Insert AI Prompt Helper"
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] hover:text-[#adc6ff] transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>

                  <div className="flex-1 relative">
                    <input
                      id="input-document-chat-question"
                      type="text"
                      value={inputQuestion}
                      onChange={(e) => setInputQuestion(e.target.value)}
                      placeholder="Ask a question about the document..."
                      className="w-full bg-[#242a3a] border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-[#dde2f8] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] transition-all text-sm shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={!inputQuestion.trim() || isAiThinking}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#005ac2] transition-colors shadow-lg glow-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                  </div>
                </form>
                <div className="text-center mt-2">
                  <span className="text-[10px] text-[#94A3B8]">
                    AI can make mistakes. Always verify facts from the source document.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Quiz Generation Interface */}
          {activeTab === 'quiz' && (
            <div className="flex-1 glass-panel rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              {!quizFinished ? (
                <div className="max-w-3xl mx-auto w-full space-y-6">
                  {/* Quiz Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs uppercase font-bold text-[#22D3EE] tracking-wider">
                        Interactive Knowledge Check
                      </span>
                      <h3 className="font-bold text-lg text-[#dde2f8] mt-0.5">
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#94A3B8]">
                        Score: <strong className="text-[#adc6ff]">{quizScore}</strong>
                      </span>
                      <div className="w-24 bg-[#0d1322] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#3B82F6] h-full transition-all duration-300"
                          style={{
                            width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="bg-[#242a3a] p-5 rounded-2xl border border-white/5">
                    <p className="text-base md:text-lg font-semibold text-[#dde2f8] leading-relaxed">
                      {quizQuestions[currentQuestionIndex].question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === quizQuestions[currentQuestionIndex].correctIndex;

                      let btnStyle = 'bg-white/5 border-white/10 hover:border-white/30 text-[#dde2f8]';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-[#3B82F6]/20 border-[#3B82F6] text-white shadow-md';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{option}</span>
                          {isAnswerSubmitted && isCorrect && (
                            <span className="material-symbols-outlined text-emerald-400 text-lg">
                              check_circle
                            </span>
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrect && (
                            <span className="material-symbols-outlined text-rose-400 text-lg">
                              cancel
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isAnswerSubmitted && (
                    <div className="p-4 rounded-xl bg-[#151b2b] border border-white/10 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#adc6ff]">
                        <span className="material-symbols-outlined text-[16px]">info</span>
                        <span>Explanation & Context</span>
                      </div>
                      <p className="text-xs text-[#c2c6d6] leading-relaxed">
                        {quizQuestions[currentQuestionIndex].explanation}
                      </p>
                      <div className="text-[10px] text-[#22D3EE] font-mono">
                        Source Reference: {quizQuestions[currentQuestionIndex].source}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end pt-4">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className="bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl glow-btn transition-all text-sm"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-[#3B82F6] hover:bg-[#005ac2] text-white font-semibold px-6 py-2.5 rounded-xl glow-btn transition-all text-sm flex items-center gap-2"
                      >
                        <span>
                          {currentQuestionIndex + 1 < quizQuestions.length
                            ? 'Next Question'
                            : 'View Results'}
                        </span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Results */
                <div className="max-w-md mx-auto my-auto text-center p-8 glass-panel rounded-3xl border border-white/10 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center mx-auto text-[#22D3EE]">
                    <span className="material-symbols-outlined text-4xl">emoji_events</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl text-[#dde2f8]">Quiz Completed!</h3>
                    <p className="text-sm text-[#c2c6d6] mt-1">
                      You scored {quizScore} out of {quizQuestions.length} on {document.title}.
                    </p>
                  </div>

                  <div className="p-4 bg-[#242a3a] rounded-2xl border border-white/5 text-left space-y-2">
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Accuracy</span>
                      <span className="text-white font-bold">
                        {Math.round((quizScore / quizQuestions.length) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Mastery Adjustment</span>
                      <span className="text-emerald-400 font-bold">+15% Level Up</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRestartQuiz}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/5 text-[#dde2f8]"
                    >
                      Retake Quiz
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

      {/* Citation Popover Modal */}
      {citationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card bg-[#151b2b]/95 rounded-2xl p-6 max-w-lg w-full border border-[#22D3EE]/30 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#22D3EE] text-[20px]">
                  find_in_page
                </span>
                <h4 className="font-bold text-sm text-[#dde2f8]">
                  Verified Document Source Excerpt
                </h4>
              </div>
              <button
                onClick={() => setCitationModal(null)}
                className="text-[#94A3B8] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#22D3EE] font-mono">
              <span className="bg-[#22D3EE]/10 px-2 py-0.5 rounded-md border border-[#22D3EE]/30">
                Page {citationModal.page}
              </span>
              <span className="bg-[#22D3EE]/10 px-2 py-0.5 rounded-md border border-[#22D3EE]/30">
                Chunk #{citationModal.chunk}
              </span>
              <span className="text-[#94A3B8]">• {document.title}</span>
            </div>

            <div className="bg-[#0d1322] p-4 rounded-xl border border-white/10 text-xs text-[#c2c6d6] leading-relaxed font-sans">
              "{citationModal.text}"
            </div>

            <button
              onClick={() => setCitationModal(null)}
              className="w-full py-2 bg-[#3B82F6] hover:bg-[#005ac2] text-white rounded-xl text-xs font-semibold glow-btn"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Floating Global Helper Button (Bottom Left) */}
      <button
        id="btn-global-psychology-helper"
        onClick={onOpenGlobalHelper}
        className="fixed bottom-8 left-8 w-14 h-14 bg-gradient-to-tr from-[#005ac2] to-[#3B82F6] rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 z-40 group border border-white/20"
        title="Open Study Assistant"
      >
        <span className="material-symbols-outlined text-[28px] group-hover:rotate-12 transition-transform duration-300">
          psychology
        </span>
      </button>
    </div>
  );
};
