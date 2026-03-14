import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getAIChatResponse } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am Toybits, your Batuan Legislative Assistant. How can I help you understand our local ordinances and resolutions today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState({
    legislations: [],
    news: [],
    sessions: [],
    members: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all context data
    const fetchData = async () => {
      try {
        const [legRes, newsRes, sessRes, memRes] = await Promise.all([
          fetch('/api/legislations'),
          fetch('/api/news'),
          fetch('/api/sessions'),
          fetch('/api/members')
        ]);

        const [legislations, news, sessions, members] = await Promise.all([
          legRes.json(),
          newsRes.json(),
          sessRes.json(),
          memRes.json()
        ]);

        setContextData({ legislations, news, sessions, members });
      } catch (err) {
        console.error('Failed to fetch context data for AI:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const context = `
        LEGISLATIONS (Ordinances & Resolutions):
        ${contextData.legislations.map((l: any) => `- ${l.legislation_type} ${l.number}: ${l.title} (${l.status})`).join('\n')}
        
        NEWS & EVENTS:
        ${contextData.news.map((n: any) => `- ${n.title} (${n.category}, ${n.event_date || 'N/A'})`).join('\n')}
        
        SESSION SCHEDULES:
        ${contextData.sessions.map((s: any) => `- ${s.title} on ${s.session_date} (${s.status})`).join('\n')}
        
        SB MEMBERS:
        ${contextData.members.map((m: any) => `- ${m.full_name} (${m.position}) - Committees: ${m.committees_chairmanship}`).join('\n')}
      `;

      const aiResponse = await getAIChatResponse(userMessage, context);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to my brain right now. Please try again later or contact our office." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[350px] sm:w-[400px] h-[500px] flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-lgu-blue-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-lgu-gold-500 p-1.5 rounded-lg">
                  <Bot className="w-5 h-5 text-lgu-blue-900" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Toybits</h3>
                  <div className="flex items-center text-[10px] text-lgu-gold-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    AI Powered
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={clsx(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={clsx(
                    "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                    msg.role === 'user' 
                      ? "bg-lgu-blue-900 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.role === 'ai' && <div className="flex items-center text-[10px] font-bold text-lgu-blue-900 uppercase tracking-wider mb-1"><Sparkles className="w-3 h-3 mr-1" /> AI Response</div>}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Ask about an ordinance..."
                  className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-lgu-blue-900 outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-lgu-blue-900 text-white p-2 rounded-xl hover:bg-lgu-blue-800 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                AI can make mistakes. Verify important info with the Secretariat.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group",
          isOpen ? "bg-white text-lgu-blue-900 rotate-90" : "bg-lgu-blue-900 text-white hover:scale-110"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white text-lgu-blue-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100">
            Ask Toybits
          </span>
        )}
      </button>
    </div>
  );
}
