import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Send, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export const ContactBox = ({ onOpenAIChat }: { onOpenAIChat: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    alert("Message sent successfully! Our team will reach out to you shortly.");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[90] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mb-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400">Direct Contact</h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div 
                onClick={() => { onOpenAIChat(); setIsOpen(false); }}
                className="flex items-center gap-4 p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Agent</div>
                  <div className="text-sm font-bold">Chat with AI</div>
                </div>
              </div>

              <a href="mailto:jack1eno.1.2401@gmail.com" className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase">Email Us</div>
                  <div className="text-sm font-bold">jack1eno.1.2401@gmail.com</div>
                </div>
              </a>
              
              <a href="tel:0848489039" className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase">Call Support</div>
                  <div className="text-sm font-bold">084 848 9039</div>
                </div>
              </a>

              <div className="pt-2">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question or leave feedback..."
                  className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none font-medium mb-3"
                />
                <Button 
                  onClick={handleSend}
                  className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xs uppercase tracking-widest gap-2"
                >
                  <Send className="w-3 h-3" /> Send Message
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? 'bg-zinc-800 text-white rotate-90' : 'bg-white text-black'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
