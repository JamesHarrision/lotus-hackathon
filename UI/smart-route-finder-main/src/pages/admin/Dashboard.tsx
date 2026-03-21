import { useState, useEffect } from "react";
import { useAppStore, BranchLoadData } from "../../store/useAppStore";
import { apiClient } from "../../lib/axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Activity, Users, Building, AlertCircle } from "lucide-react";
import { useDemoSimulation } from "../../hooks/useDemoSimulation";
import { motion, AnimatePresence } from "framer-motion";
import { CardSkeleton, MetricSkeleton } from "@/components/SkeletonLoader";

interface Branch {
  id: number;
  name: string;
  address: string;
  maxCapacity: number;
  currentLoad: number;
}

const AdminDashboard = () => {
  const { user, branches: liveBranches, updateBranchLoad } = useAppStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Activate Demo Simulation to bounce the load numbers up and down
  useDemoSimulation(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/branches?enterpriseId=${user.id}`);
        setBranches(data.data || []);
        
        // Seed Zustand store with initial branch data
        data.data.forEach((b: Branch) => {
          updateBranchLoad({
            branchId: b.id,
            currentLoad: b.currentLoad,
            maxCapacity: b.maxCapacity,
            loadPercentage: Math.round((b.currentLoad / b.maxCapacity) * 10000) / 100
          });
        });

      } catch (error) {
        console.error("Failed to load admin dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user, updateBranchLoad]);

  // Merge static with live socket data and filter by search
  const filteredBranches = branches
    .map(b => {
      const liveData = liveBranches[b.id] as BranchLoadData | undefined;
      return liveData 
        ? { ...b, currentLoad: liveData.currentLoad, maxCapacity: liveData.maxCapacity }
        : b;
    })
    .filter(b => 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.address.toLowerCase().includes(search.toLowerCase())
    );

  const totalCapacity = filteredBranches.reduce((acc, curr) => acc + curr.maxCapacity, 0);
  const totalLoad = filteredBranches.reduce((acc, curr) => acc + curr.currentLoad, 0);
  const networkLoadPct = totalCapacity > 0 ? Math.round((totalLoad / totalCapacity) * 100) : 0;

  let networkColor = "text-emerald-500";
  if (networkLoadPct > 80) networkColor = "text-rose-500";
  else if (networkLoadPct > 50) networkColor = "text-amber-500";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 bg-clip-text text-transparent tracking-tight leading-tight">
            Enterprise Hub
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium italic">Command center for real-time branch network telemetry.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <MetricSkeleton key={i} />)
        ) : (
          <>
            <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Node Count</CardTitle>
                <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Building className="h-5 w-5 text-indigo-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{branches.length}</div>
                <p className="text-[10px] text-emerald-500 mt-2 font-black uppercase tracking-widest">Active Assets</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Aggregate Visitors</CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{totalLoad} <span className="text-xl text-zinc-400 font-bold">/ {totalCapacity}</span></div>
                <p className="text-[10px] text-zinc-500 mt-2 font-black uppercase tracking-widest">Network Throughput</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Saturation Index</CardTitle>
                <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${networkLoadPct > 80 ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
                  <Activity className={`h-5 w-5 ${networkColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-black ${networkColor}`}>
                  {networkLoadPct}%
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 font-black uppercase tracking-widest">Global Load Factor</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
        <Input 
          placeholder="Filter nodes by identity..." 
          className="pl-12 h-14 text-base bg-white dark:bg-zinc-900/50 border-none shadow-xl rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-bold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div 
           layout
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBranches.map((branch, idx) => {
              const loadPct = branch.maxCapacity > 0 ? (branch.currentLoad / branch.maxCapacity) * 100 : 0;
              
              let statusColor = "bg-emerald-500";
              let textColor = "text-emerald-600 dark:text-emerald-400";
              let bgColor = "bg-emerald-500/10";
              let borderColor = "border-emerald-500/20";
              
              if (loadPct > 80) {
                statusColor = "bg-rose-500";
                textColor = "text-rose-600 dark:text-rose-400";
                bgColor = "bg-rose-500/10";
                borderColor = "border-rose-500/20";
              } else if (loadPct > 50) {
                statusColor = "bg-amber-500";
                textColor = "text-amber-600 dark:text-amber-400";
                bgColor = "bg-amber-500/10";
                borderColor = "border-amber-500/20";
              }

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  key={branch.id} 
                >
                  <Card className="group overflow-hidden rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 pointer-events-auto shadow-sm">
                    {/* Top Status Border line */}
                    <div className={`h-1.5 w-full ${statusColor}`} />
                    
                    <CardHeader className="pb-4 relative">
                      <div className="flex justify-between items-start">
                        <div className="pr-8">
                          <CardTitle className="text-lg font-bold group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{branch.name}</CardTitle>
                          <p className="text-[10px] text-zinc-400 mt-1.5 line-clamp-2 h-8 leading-relaxed font-bold uppercase tracking-widest">
                            {branch.address}
                          </p>
                        </div>
                        {/* Status indicator */}
                        <div className={`absolute top-4 right-4 p-2 rounded-xl ${bgColor} ${borderColor} border flex items-center justify-center shadow-lg`}>
                          <Activity className={`w-4 h-4 ${textColor}`} />
                          {loadPct > 80 && (
                             <span className="absolute flex h-3 w-3 -top-1 -right-1">
                               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColor} opacity-75`}></span>
                               <span className={`relative inline-flex rounded-full h-3 w-3 ${statusColor}`}></span>
                             </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-[1.5rem] p-5 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                        <div className="flex justify-between items-end mb-4">
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            Core Load
                          </span>
                          <div className="flex flex-col items-end">
                            <span className={`font-black text-3xl leading-none ${textColor} tracking-tighter`}>
                              {branch.currentLoad}
                            </span>
                            <span className="text-[10px] font-black text-zinc-400 mt-1 tracking-widest">/ {branch.maxCapacity} MAX</span>
                          </div>
                        </div>
                        
                        {/* Animated Progress Bar */}
                        <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative shadow-inner p-1">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(loadPct, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${statusColor} rounded-full relative`}
                          >
                            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                          </motion.div>
                        </div>
                        
                        {loadPct > 80 && (
                          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Saturation Alert
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredBranches.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center flex flex-col items-center justify-center"
            >
              <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900 mb-6 shadow-inner">
                <Search className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Zero Matches</h3>
              <p className="text-zinc-500 mt-2 font-medium">Verify your filter parameters or network status.</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
