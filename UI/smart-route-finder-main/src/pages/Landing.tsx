import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/axios";
import {
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  MapPin,
  Building2,
  Users,
  MousePointer2,
  Navigation2,
  Search,
  Globe,
  LineChart,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIChatbot } from "@/components/AIChatbot";
import { ContactBox } from "@/components/ContactBox";

const Landing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [exaResults, setExaResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("intelligence");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await apiClient.get(`/exa/search?q=${encodeURIComponent(searchQuery)}`);
      setExaResults(data.data || []);
      // Scroll to results
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Initial data for "Intelligence"
    const fetchInitial = async () => {
      try {
        const { data } = await apiClient.get(`/exa/search?q=latest breakthroughs in AI queue management 2024`);
        setExaResults(data.data || []);
      } catch (err) {
        console.error("Initial fetch failed", err);
      }
    };
    fetchInitial();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500">
      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-5%] w-[35%] h-[35%] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">YOGO</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-500 dark:text-zinc-400">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Intelligence</a>
          <a href="#solutions" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Solutions</a>
          <a href="#enterprise" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Enterprise</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")} className="font-bold hover:bg-black/5 dark:hover:bg-white/5">Sign In</Button>
          <Button onClick={() => navigate("/register")} className="rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold px-6 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
            Join the Network
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto text-center md:text-left grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            AI Algorithm v2.4 Live
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            The Future of <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Smart Redistribution
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-400 max-w-xl font-medium leading-relaxed">
            Eliminate wait times and maximize branch efficiency with our real-time AI routing engine. Smart incentives for users, deep analytics for enterprises.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
              <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="h-16 px-8 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-black text-lg group transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/10"
            >
              Launch App <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md group">
               <input 
                type="text" 
                placeholder="Ask AI anything about queue tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
               />
               <button 
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-2 h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-colors disabled:opacity-50 text-white"
               >
                 {isSearching ? <Sparkles className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
               </button>
            </form>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300`}>
                  USR{i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                +2k
              </div>
            </div>
            <p className="text-sm text-zinc-500 font-bold">Already optimizing 50+ Enterprises</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/40 to-violet-600/40 blur-[100px] group-hover:blur-[120px] transition-all" />
          <div className="relative rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-3xl p-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="text-[10px] font-bold text-zinc-500 flex items-center gap-2">
                <Navigation2 className="w-3 h-3 animate-bounce" />
                tracking_id: 8B-229
              </div>
            </div>
            {/* Mock Dashboard Preview */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 p-4">
                  <div className="text-[10px] font-black uppercase text-zinc-500 mb-1">Total Capacity</div>
                  <div className="text-2xl font-black">94.2%</div>
                  <div className="w-full h-1 bg-zinc-700 rounded-full mt-2 overflow-hidden">
                    <div className="w-[94%] h-full bg-indigo-500" />
                  </div>
                </div>
                <div className="h-24 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 p-4">
                  <div className="text-[10px] font-black uppercase text-indigo-500 dark:text-indigo-400 mb-1">Optimal Shift</div>
                  <div className="text-2xl font-black text-zinc-900 dark:text-white">+18.4%</div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-bold">Efficiency Boost</div>
                </div>
              </div>
              <div className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 flex items-center justify-center relative group overflow-hidden">
                <BarChart3 className="w-20 h-20 text-indigo-500/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-white/90 dark:from-zinc-950/80 to-transparent">
                  <div className="font-bold text-sm text-zinc-900 dark:text-white">Real-time Load Balancer</div>
                  <div className="text-xs text-zinc-500">Syncing with 12 edge nodes...</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Engineered for Reliability</h2>
          <p className="text-zinc-500 font-medium max-w-2xl mx-auto italic">Our AI doesn't just find paths; it predicts congestion before it happens.</p>
        </div>

        <div id="search-results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exaResults.length > 0 ? (
            exaResults.map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all group flex flex-col h-full shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 truncate max-w-[150px]">
                    {new URL(result.url).hostname}
                  </span>
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tight line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {result.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-500 leading-relaxed font-medium text-sm mb-6 flex-1 line-clamp-3">
                  {result.author ? `By ${result.author} • ` : ''} Discovery powered by Exa Semantic Intelligence.
                </p>
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Read Source <ArrowRight className="ml-2 w-3 h-3" />
                </a>
              </motion.div>
            ))
          ) : (
            // Fallback features if no exa results yet
            [
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Nano-Second Routing",
                desc: "Proprietary matrix algorithms calculate thousands of branch permutations in under 100ms.",
                color: "from-blue-600 to-indigo-600"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Grade",
                desc: "Role-based access control and detailed audit logs for large-scale multi-branch operations.",
                color: "from-indigo-600 to-violet-600"
              },
              {
                icon: <MousePointer2 className="w-8 h-8" />,
                title: "Direct Conversion",
                desc: "Turn lost customers into conversions with location-aware incentive redistribution.",
                color: "from-violet-600 to-purple-600"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all group shadow-sm"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/10 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Industry Solutions
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Retail & Service <br /> Optimization.</h2>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed">
              Whether you're a coffee chain managing morning rushes or a retail giant balancing weekend foot traffic, YOGO provides the precision tools to redistribute load instantly.
            </p>
            <ul className="space-y-4">
              {[
                "Dynamic Queue Balancing",
                "Real-time Incentive Engine",
                "Advanced Predictive Analytics",
                "Seamless POS Integration"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] pointer-events-none" />
            <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 overflow-hidden shadow-xl dark:shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Global Flow Monitor</span>
                <LineChart className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="space-y-6">
                {[75, 45, 90].map((v, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-zinc-400">Region {i+1} Efficiency</span>
                      <span className="text-emerald-400">{v}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${v}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className="h-full bg-emerald-500" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center group border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/60 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <Building2 className="w-16 h-16 mx-auto mb-8 text-white/50" />
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Scale Your Infrastructure.</h2>
            <p className="text-xl text-indigo-100/70 font-medium">
              Join the most advanced network of smart branches. Get dedicated support, custom algorithms, and unlimited edge node connections.
            </p>
            <div className="pt-8">
              <Button 
                size="lg" 
                onClick={() => setIsChatOpen(true)}
                className="h-16 px-12 rounded-2xl bg-white text-indigo-600 hover:bg-zinc-100 font-black text-xl active:scale-95 transition-all shadow-2xl"
              >
                Talk to AI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Overlay */}
      <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating Contact Box */}
      <ContactBox onOpenAIChat={() => setIsChatOpen(true)} />

      {/* App Stats Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-white/5 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center group">
          {[
            { label: "Active Nodes", value: "850+" },
            { label: "Daily Routings", value: "125k" },
            { label: "Wait Reduction", value: "42%" },
            { label: "Network Uptime", value: "99.9%" }
          ].map((s, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent group-hover:to-indigo-400 transition-all duration-1000">
                {s.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto space-y-12">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none"> Ready to Optimize <br /> Your Network?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xl active:scale-95 transition-all shadow-2xl shadow-indigo-600/30 w-full sm:w-auto"
          >
            Create Master Account
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/login")}
            className="h-16 px-12 rounded-2xl font-bold text-xl w-full sm:w-auto hover:bg-white/5"
          >
            Login to Console
          </Button>
        </div>
        <p className="text-zinc-600 font-medium">Join over 200+ companies already scaling with YOGO AI.</p>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-200 dark:border-white/5 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-zinc-500 font-medium text-sm">
        <div className="flex items-center gap-2 grayscale dark:brightness-50">
          <Zap className="w-5 h-5 fill-zinc-500" />
          <span className="font-black tracking-tighter uppercase italic">YOGO AI</span>
        </div>
        <div className="flex gap-12">
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Security</a>
        </div>
        <div>
          © 2026 YOGO Labs. Engineered with precision.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
