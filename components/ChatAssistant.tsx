import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can answer questions about our events, team, or projects. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await sendMessageToGemini(userMsg);

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-ieee-blue hover:bg-blue-600 text-white rounded-none border-2 border-black dark:border-white shadow-neo dark:shadow-neo-white transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center"
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-96 bg-white dark:bg-slate-900 flex flex-col border-2 border-black dark:border-white shadow-neo-lg dark:shadow-neo-white animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-ieee-blue border-b-2 border-black dark:border-white p-4 flex items-center gap-2">
            <Bot className="text-white" size={20} />
            <h3 className="text-white font-bold font-sans">Community Assistant</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 border-2 border-black dark:border-white flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-neo-yellow text-black' : 'bg-ieee-blue text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 text-sm font-medium border-2 border-black dark:border-white shadow-neo-sm dark:shadow-neo-white-sm max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-white dark:bg-slate-800 text-black dark:text-white'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                 <div className="w-8 h-8 border-2 border-black dark:border-white bg-ieee-blue text-white flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 border-2 border-black dark:border-white shadow-neo-sm dark:shadow-neo-white-sm">
                  <Loader2 className="animate-spin text-black dark:text-white" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-neo-yellow dark:bg-slate-800 border-t-2 border-black dark:border-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about events, team..."
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border-2 border-black dark:border-white focus:outline-none focus:shadow-neo-sm text-sm dark:text-white placeholder:text-slate-500 font-medium"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black dark:border-white transition-all active:translate-y-1"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};