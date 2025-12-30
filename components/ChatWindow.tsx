
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { APP_THEME } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full parchment-bg">
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-stone-200 z-10 md:hidden">
         <h1 className="font-bold text-stone-800 flex items-center gap-2">
            <span className="text-[#D4AF37]">⛪</span> EOTC AI
         </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-5xl border-4 border-[#D4AF37]">
              ✝️
            </div>
            <div>
              <h2 className="text-3xl font-bold text-stone-800">Peace be unto you</h2>
              <p className="text-stone-600 mt-2 text-lg">
                Ask me anything about the teachings, history, or spiritual traditions of the Ethiopian Orthodox Tewahedo Church.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
              {[
                "Tell me about Saint Yared's life",
                "What are the seven sacraments?",
                "Explain the fast of Filseta",
                "What is the history of Axum?"
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  className="p-4 bg-white rounded-xl border border-stone-200 hover:border-[#D4AF37] hover:shadow-md transition-all text-sm font-medium text-stone-700"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === Role.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                message.role === Role.USER
                  ? 'bg-[#009B4D] text-white rounded-br-none'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.content}
              </div>
              <div className={`mt-2 text-[10px] opacity-60 ${message.role === Role.USER ? 'text-right' : ''}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-stone-500 font-medium ml-2">Seeking tradition...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-200">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your question in Amharic, English, Oromo or Tigrigna..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#b8972e] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-stone-400 text-center mt-3">
          For deep spiritual guidance or confession, please consult your Father of Confession.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
