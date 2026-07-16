'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I am your Mauritian Health Companion. If you are feeling unwell, tell me your symptoms so we can assess your situation." }
  ]);
  const [input, setInput] = useState('');
  const [ageGroup, setAgeGroup] = useState('13-65');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, ageGroup }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages([...updatedMessages, { role: 'model', text: data.reply }]);
      } else {
        setMessages([...updatedMessages, { role: 'model', text: "Sorry, I had an issue connecting. Please try again." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: 'model', text: "Error reaching the server. Ensure your dev server is active." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      {/* Landing Page Content */}
      <header className="text-center max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
          Health Alert Mauritius
        </h1>
        <p className="text-slate-400 mt-3 text-sm">
          A secure, rapid system designed to monitor public outbreaks and secure early medical awareness.
        </p>
        <p className="text-xs text-slate-600 mt-6 animate-pulse">
          Click the chatbot bubble in the bottom-right corner to start your live triage session.
        </p>
      </header>

      {/* 💬 INTERACTIVE CHATBOT SYSTEM */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Expanded Real Chat Window */}
        {isOpen && (
          <div className="w-[360px] sm:w-[420px] h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 transform scale-100 origin-bottom-right">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🩺</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-950">AI Triage Companion</h3>
                  <p className="text-[10px] text-teal-100">Mauritian Health Support</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-950 hover:bg-black/10 rounded-full w-7 h-7 flex items-center justify-center transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {/* Age Configurator Banner */}
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
              <span>Patient Profile:</span>
              <div className="flex gap-1.5">
                {['0-12', '13-65', '66-100'].map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setAgeGroup(group)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all border ${
                      ageGroup === group
                        ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {group === '0-12' && 'Child'}
                    {group === '13-65' && 'Adult'}
                    {group === '66-100' && 'Elder'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-teal-500 text-slate-950 rounded-tr-none font-medium'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1.5 animate-pulse">
                    <span>Companion is thinking</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Dynamic Ministry Resource Hub */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-850 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 text-[10px]">Official Medical Source:</span>
              <a
                href="https://health.govmu.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 font-bold transition-all flex items-center gap-1"
              >
                Ministry of Health Website 🌐
              </a>
            </div>

            {/* Interactive Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type details (e.g., I have severe joint pain)..."
                disabled={loading}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
              >
                Send
              </button>
            </form>

          </div>
        )}

        {/* Floating Toggle Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          {isOpen ? (
            <span className="text-xl font-bold">✕</span>
          ) : (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </div>
    </main>
  );
}