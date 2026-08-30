import React, { useState, useRef, useEffect } from 'react';
import { ROBOT_AI_AVATAR } from '../data/mockData';

interface GlobalChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onSelectDocLink?: (docId: string) => void;
}

interface MiniMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const GlobalChatDrawer: React.FC<GlobalChatDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<MiniMessage[]>([
    {
      id: 'g1',
      sender: 'ai',
      text: "👋 Hi there! I'm your StudyAI Companion. Ask me to break down concepts from any of your uploaded materials, generate rapid quiz cards, or optimize your study plan.",
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (customText?: string) => {
    const text = customText || inputVal;
    if (!text.trim() || isTyping) return;

    const userMsg: MiniMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('recursion')) {
        reply = `🧠 **Recursion Breakdown:**
1. **Base Case**: The stopping rule (e.g., \`if n <= 1: return 1\`). Without this, recursion causes Stack Overflow.
2. **Recursive Step**: Calling the function on a strictly smaller sub-problem (e.g., \`n * factorial(n - 1)\`).
3. **Call Stack**: Each invocation is pushed on the stack; upon reaching the base case, return values propagate back down.`;
      } else if (lower.includes('dijkstra') || lower.includes('algorithm')) {
        reply = `⚡ **Dijkstra's Shortest Path:**
• Finds shortest paths from a single source node to all other nodes on weighted graphs with **non-negative weights**.
• Greedily chooses the minimum distance unvisited vertex using a **Min-Heap / Priority Queue**.
• Time Complexity: **O((V + E) log V)**.`;
      } else if (lower.includes('study plan') || lower.includes('midterm') || lower.includes('velocity')) {
        reply = `📊 **Current Study Plan Status:**
• **High Priority**: Master **Recursion** (25% mastery - estimated 45 mins).
• **Medium Priority**: Practice **Linked List pointer reversal** (60% mastery).
• **Upcoming**: Data Structures Midterm in 3 days! Take a 10-question practice test today.`;
      } else {
        reply = `💡 Based on your current materials (*Introduction to Algorithms*, *Data Structures 101*, and *Microeconomics*):

Focus on understanding core computational invariants and asymptotic complexity bounds. Let me know if you would like me to generate a 3-question mini quiz on this!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-32px)] glass-card bg-[#151b2b]/95 rounded-3xl border border-[#3B82F6]/40 shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0d1322]/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#22D3EE]/50">
            <img
              src={ROBOT_AI_AVATAR}
              alt="AI Companion"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#dde2f8]">Smart Learning Assistant</h4>
            <span className="text-[10px] text-[#22D3EE] flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse"></span>
              Online & Indexed
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-white p-1 rounded-lg"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => {
          const isAi = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center flex-shrink-0 text-xs text-[#adc6ff]">
                  🤖
                </div>
              )}
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[82%] ${
                  isAi
                    ? 'glass-panel rounded-tl-xs border border-white/10 text-[#dde2f8] whitespace-pre-line'
                    : 'bg-[#3B82F6] text-white rounded-tr-xs shadow-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center flex-shrink-0 text-xs">
              🤖
            </div>
            <div className="glass-panel p-2.5 rounded-2xl rounded-tl-xs text-xs text-[#22D3EE] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm animate-spin">
                sync
              </span>
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-white/5 bg-[#0d1322]/40 text-[10px]">
        <button
          onClick={() => handleSend('Explain Recursion base cases with an example')}
          className="whitespace-nowrap px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#adc6ff] border border-white/10"
        >
          Recursion help
        </button>
        <button
          onClick={() => handleSend('What are Dijkstra algorithm steps?')}
          className="whitespace-nowrap px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#22D3EE] border border-white/10"
        >
          Dijkstra steps
        </button>
        <button
          onClick={() => handleSend('Show my study plan priority')}
          className="whitespace-nowrap px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#d0bcff] border border-white/10"
        >
          My focus
        </button>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 bg-[#0d1322]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-[#242a3a] rounded-xl py-2.5 pl-3 pr-10 text-xs text-white placeholder:text-[#94A3B8] border border-white/10 focus:outline-none focus:border-[#3B82F6]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="absolute right-1.5 p-1.5 bg-[#3B82F6] hover:bg-[#005ac2] disabled:opacity-40 text-white rounded-lg text-xs glow-btn"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
