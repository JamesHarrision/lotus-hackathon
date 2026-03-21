import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles, Globe, ExternalLink, Brain, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "../lib/axios";

interface Message {
  role: "ai" | "user";
  content: string;
  results?: any[];
  synthesis?: string;
}

export const AIChatbot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm YOGO Neural Agent. I'm connected to Exa's real-time intelligence network. Ask me anything, and I'll research and synthesize an answer for you." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isSearching]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    setIsTyping(true);
    setIsSearching(true);
    
    try {
      const { data } = await apiClient.get(`/exa/search?q=${encodeURIComponent(userMsg)}`);
      const results = data.data || [];
      
      setIsSearching(false);
      
      let aiResponse = "I've synthesized the following intelligence from the real-time web:";
      let synthesis = "";
      
      if (results.length > 0) {
        // Build a synthesis from summaries
        synthesis = results
          .filter((r: any) => r.summary)
          .map((r: any) => r.summary)
          .join(" ");
          
        if (!synthesis && results[0].highlights?.[0]) {
           synthesis = results[0].highlights[0];
        }
      } else {
        aiResponse = "I couldn't find specific real-time data for that query. Based on YOGO's optimization principles, we focus on dynamic load balancing and predictive routing.";
      }

      setMessages(prev => [...prev, { 
        role: "ai", 
        content: aiResponse,
        synthesis: synthesis,
        results: results.slice(0, 3) 
      }]);

    } catch (error) {
      console.error("Neural search failed", error);
      setMessages(prev => [...prev, { role: "ai", content: "I encountered a neural latency issue while searching. Please try again." }]);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9, rotate: 5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 100, scale: 0.9, rotate: 5 }}
          className="fixed bottom-8 right-8 w-[500px] h-[700px] bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_0_80px_-20px_rgba(79,70,229,0.4)] z-[100] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 flex items-center justify-between shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-white tracking-[0.3em] uppercase text-[11px]">YOGO Neural Interface</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-[10px] text-indigo-100 font-black uppercase tracking-widest opacity-90">AI Search Active</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-90 bg-white/5 border border-white/10">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"
          >
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex flex-col ${msg.role === 'ai' ? 'items-start' : 'items-end'}`}
              >
                <div className={`max-w-[95%] p-6 rounded-[2rem] text-[15px] font-medium leading-relaxed shadow-lg ${
                  msg.role === 'ai' 
                    ? 'bg-zinc-800/90 text-zinc-100 border border-white/5 rounded-tl-none' 
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/30'
                }`}>
                  {msg.content}
                </div>
                
                {msg.synthesis && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <Quote className="absolute top-4 right-4 w-12 h-12 text-indigo-500/10" />
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                       <Sparkles className="w-4 h-4" /> Neural Synthesis
                    </h5>
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium italic">
                       {msg.synthesis}
                    </p>
                  </motion.div>
                )}
                
                {msg.results && (
                  <div className="mt-8 space-y-4 w-full">
                    <h6 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2">Source Nodes</h6>
                    {msg.results.map((res, ri) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ri * 0.1 }}
                        key={ri}
                        className="p-6 bg-zinc-950/40 border border-white/5 rounded-[1.5rem] hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-indigo-400" />
                             </div>
                             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate max-w-[200px]">
                               {new URL(res.url).hostname}
                             </span>
                          </div>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                             <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400" />
                          </a>
                        </div>
                        <h4 className="text-sm font-black text-zinc-100 mb-3 tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{res.title}</h4>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            
            {(isTyping || isSearching) && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-start">
                  <div className="bg-zinc-800/50 p-5 rounded-[1.5rem] rounded-tl-none border border-white/5 flex gap-2 items-center">
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2.5 h-2.5 bg-violet-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  </div>
                </div>
                {isSearching && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-3"
                  >
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    Neural Synthesis in Progress...
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-10 bg-zinc-950/80 border-t border-white/5 backdrop-blur-2xl">
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask YOGO AI to research and synthesize..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full h-18 bg-zinc-900 border border-zinc-800 rounded-[2rem] px-8 pr-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-base text-white placeholder:text-zinc-600 uppercase tracking-tight"
              />
              <motion.button 
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={isTyping || isSearching}
                className="absolute right-4 top-4 h-10 w-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-2xl shadow-indigo-600/40 disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] justify-center opacity-40">
              <Sparkles className="w-3.5 h-3.5" /> Intelligence via Exa Neural Core
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
