import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Building2, ChevronRight, LogIn, Sparkles, Home as HomeIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CardSkeleton } from "@/components/SkeletonLoader";

interface Enterprise {
  id: number;
  name: string;
  _count?: {
    branches: number;
  };
}

const Home = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/enterprises");
        setEnterprises(data.data || []);
      } catch (error) {
        console.error("Failed to fetch enterprises", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnterprises();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/20 pb-20"
    >
      
      {/* Hero Header Section */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10"
          >
            <div className="space-y-6 max-w-2xl">
              <div 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer group mb-4 w-fit"
              >
                <div className="p-1.5 bg-indigo-600 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="text-sm font-black tracking-tighter uppercase italic text-zinc-900 dark:text-zinc-50">YOGO</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-indigo-500/20" /> Next-Gen Smart Routing
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[0.9]">
                Find the <span className="text-indigo-600 dark:text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">Perfect</span> Spot.
              </h1>
              <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-lg">
                Beat the queue with AI-powered load balancing. Select a partner below to see live branch telemetry.
              </p>
            </div>
            <motion.div
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/login')} 
                className="rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all h-16 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs border-none"
              >
                Enterprise Portal <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto py-16 px-6 max-w-6xl">
        <div className="mb-12 flex items-center justify-between">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Available Networks</h2>
           <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 ml-8 opacity-50" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {enterprises.map((ent, idx) => (
                <motion.div
                  key={ent.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Card 
                    className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer h-full flex flex-col shadow-sm"
                    onClick={() => navigate(`/enterprise/${ent.id}`)}
                  >
                    {/* Pulsing indicator for beauty */}
                    <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform shadow-lg shadow-emerald-500/50" />
                    
                    <CardHeader className="p-0 border-b border-zinc-100 dark:border-zinc-800 relative z-10 overflow-hidden h-48 rounded-t-[2.5rem]">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />
                      
                      <div className="absolute bottom-6 left-8 right-8 space-y-2">
                        <CardTitle className="text-3xl font-black text-white tracking-tighter leading-none uppercase">
                          {ent.name}
                        </CardTitle>
                        <div className="flex items-center text-[10px] font-black tracking-widest uppercase gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit text-zinc-100 border border-white/20">
                          <MapPin className="h-3 w-3 text-emerald-400" />
                          {ent._count?.branches || 0} Nodes Live
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-10 pt-0 flex-1 flex flex-col justify-between">
                      <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed h-12 line-clamp-2">
                        Real-time capacity intelligence for all {ent.name} endpoints.
                      </CardDescription>
                      
                      <div className="mt-10 pt-8 border-t border-zinc-50 dark:border-zinc-800 flex w-full items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-indigo-600 transition-colors">Launch Map Control</span>
                        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-500">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {enterprises.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800"
              >
                <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] flex items-center justify-center text-zinc-300 mb-8 shadow-inner">
                  <Building2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter">Network Offline</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mt-3 font-medium">
                  We're currently syncing with new enterprise partners. Check back shortly.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
