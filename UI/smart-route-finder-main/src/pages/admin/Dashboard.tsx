import { useState, useEffect } from "react";
import { useAppStore, BranchLoadData } from "../../store/useAppStore";
import { apiClient } from "../../lib/axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Activity, 
  Users, 
  Building, 
  AlertCircle, 
  BarChart3, 
  Ticket, 
  Plus, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CardSkeleton, MetricSkeleton } from "@/components/SkeletonLoader";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Branch {
  id: number;
  name: string;
  address: string;
  maxCapacity: number;
  currentLoad: number;
}

interface AnalyticsPoint {
  time: string;
  avgLoad: number;
  logCount: number;
}

interface Incentive {
  id: number;
  code: string;
  description: string;
  discountVal: number;
  isPercentage: boolean;
}

const AdminDashboard = () => {
  const { user, branches: liveBranches, updateBranchLoad } = useAppStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsPoint[]>([]);
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"telemetry" | "incentives">("telemetry");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch dashboard data (Overview)
        const branchRes = await apiClient.get(`/branches?enterpriseId=${user.id}`);
        setBranches(branchRes.data.data || []);
        
        // Seed Zustand store with initial branch data
        branchRes.data.data.forEach((b: Branch) => {
          updateBranchLoad({
            branchId: b.id,
            currentLoad: b.currentLoad,
            maxCapacity: b.maxCapacity,
            loadPercentage: Math.round((b.currentLoad / b.maxCapacity) * 10000) / 100
          });
        });

        // Fetch real analytics (X-axis: time, Y-axis: load)
        const analyticsRes = await apiClient.get(`/enterprises/${user.id}/analytics`);
        setAnalytics(analyticsRes.data.timeSeries || []);

        // Fetch incentives
        const incentiveRes = await apiClient.get(`/incentives?enterpriseId=${user.id}`);
        setIncentives(incentiveRes.data.data || []);

      } catch (error) {
        console.error("Failed to load admin dashboard", error);
        toast({
          title: "Network Error",
          description: "Could not synchronize with the neural data server.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, updateBranchLoad, toast]);

  const handleDeleteIncentive = async (id: number) => {
    try {
      await apiClient.delete(`/incentives/${id}`);
      setIncentives(prev => prev.filter(inc => inc.id !== id));
      toast({ title: "Incentive Removed", description: "Node reward system updated." });
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
  };

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

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-zinc-900 via-indigo-600 to-zinc-500 dark:from-zinc-100 dark:via-indigo-400 dark:to-zinc-500 bg-clip-text text-transparent tracking-tight leading-tight">
            Enterprise Hub
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium italic">Command center for real-time branch network telemetry.</p>
        </div>
        
        <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-[1.2rem] border border-zinc-200 dark:border-zinc-800 shadow-inner">
          <button 
            onClick={() => setActiveTab("telemetry")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'telemetry' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            Telemetry
          </button>
          <button 
             onClick={() => setActiveTab("incentives")}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'incentives' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            Incentive Store
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "telemetry" ? (
          <motion.div 
            key="telemetry"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <MetricSkeleton key={i} />)
              ) : (
                <>
                  <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                       <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Node Persistence</CardTitle>
                       <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                          <Building className="h-6 w-6 text-indigo-500" />
                       </div>
                    </CardHeader>
                    <CardContent>
                       <div className="text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">{branches.length}</div>
                       <p className="text-[10px] text-emerald-500 mt-3 font-black uppercase tracking-widest flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Assets
                       </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                       <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Global Throughput</CardTitle>
                       <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                          <Users className="h-6 w-6 text-blue-500" />
                       </div>
                    </CardHeader>
                    <CardContent>
                       <div className="text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                         {totalLoad} <span className="text-xl text-zinc-400 font-bold tracking-normal opacity-50">/ {totalCapacity}</span>
                       </div>
                       <p className="text-[10px] text-zinc-500 mt-3 font-black uppercase tracking-widest">Aggregate Traffic Flow</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                       <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Saturation Factor</CardTitle>
                       <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 shadow-inner ${networkLoadPct > 80 ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
                          <Activity className={`h-6 w-6 ${networkLoadPct > 80 ? 'text-rose-500' : 'text-amber-500'}`} />
                       </div>
                    </CardHeader>
                    <CardContent>
                       <div className={`text-5xl font-black tracking-tighter ${networkLoadPct > 80 ? 'text-rose-500' : 'text-emerald-500'}`}>
                         {networkLoadPct}%
                       </div>
                       <p className="text-[10px] text-zinc-500 mt-3 font-black uppercase tracking-widest">Network Load Density</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Real-Time Analytics Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <Card className="rounded-[2.5rem] border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-indigo-500/5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl overflow-hidden group">
                  <CardHeader className="p-8 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight">Active Load Analytics</CardTitle>
                        <CardDescription className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Last 24-hours historical telemetry</CardDescription>
                      </div>
                      <div className="p-4 bg-indigo-500/10 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform">
                        <TrendingUp className="w-6 h-6 text-indigo-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[350px] p-8">
                     {loading ? (
                        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-2xl" />
                     ) : (
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={analytics}>
                            <defs>
                              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                            <XAxis 
                               dataKey="time" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{fontSize: 10, fill: '#71717a', fontWeight: 'bold'}} 
                               minTickGap={30}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a', fontWeight: 'bold'}} />
                            <Tooltip 
                               contentStyle={{ 
                                 backgroundColor: 'rgba(0,0,0,0.8)', 
                                 border: 'none', 
                                 borderRadius: '1rem',
                                 boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                               }}
                               itemStyle={{ color: '#818cf8', fontWeight: '800' }}
                            />
                            <Area 
                               type="monotone" 
                               dataKey="avgLoad" 
                               name="System Traffic"
                               stroke="#6366f1" 
                               strokeWidth={4}
                               fillOpacity={1} 
                               fill="url(#colorLoad)" 
                            />
                         </AreaChart>
                       </ResponsiveContainer>
                     )}
                  </CardContent>
               </Card>

               <Card className="rounded-[2.5rem] border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-emerald-500/5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl overflow-hidden group">
                  <CardHeader className="p-8 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight">Request Density</CardTitle>
                        <CardDescription className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">API interactions per node cluster</CardDescription>
                      </div>
                      <div className="p-4 bg-emerald-500/10 rounded-2xl -rotate-3 group-hover:rotate-0 transition-transform">
                        <BarChart3 className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[350px] p-8">
                     {loading ? (
                        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-2xl" />
                     ) : (
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={analytics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a', fontWeight: 'bold'}} minTickGap={30} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a', fontWeight: 'bold'}} />
                            <Tooltip cursor={{fill: 'rgba(99,102,241,0.05)'}} />
                            <Bar 
                              dataKey="logCount" 
                              name="Log Entries"
                              fill="#10b981" 
                              radius={[6, 6, 0, 0]} 
                              barSize={12}
                            />
                         </BarChart>
                       </ResponsiveContainer>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Branch List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <div className="relative max-w-sm w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                      placeholder="Filter nodes..." 
                      className="pl-12 h-14 bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl font-bold"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {filteredBranches.map((branch, idx) => {
                    const loadPct = branch.maxCapacity > 0 ? (branch.currentLoad / branch.maxCapacity) * 100 : 0;
                    const isBusy = loadPct > 80;
                    return (
                      <Card className="rounded-[2.2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-2xl transition-all h-full flex flex-col cursor-pointer shadow-sm">
                         <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                               <div className={`p-4 rounded-2xl ${isBusy ? 'bg-rose-500/10' : 'bg-emerald-500/10'} shadow-inner`}>
                                 <Building className={`w-6 h-6 ${isBusy ? 'text-rose-500' : 'text-emerald-500'}`} />
                               </div>
                               <div className="flex h-3 w-3 relative">
                                  <span className={`animate-ping absolute h-full w-full rounded-full ${isBusy ? 'bg-rose-500' : 'bg-emerald-500'} opacity-75`} />
                                  <span className={`relative h-3 w-3 rounded-full ${isBusy ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                               </div>
                            </div>
                            <CardTitle className="text-xl font-black tracking-tight line-clamp-1 uppercase group-hover:text-indigo-500 transition-colors">{branch.name}</CardTitle>
                            <p className="text-[10px] font-black text-zinc-400 mt-2 uppercase tracking-widest line-clamp-2 leading-relaxed">{branch.address}</p>
                         </CardHeader>
                         <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-end">
                            <div className="space-y-4">
                               <div className="flex justify-between items-end">
                                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Load</span>
                                  <span className={`text-2xl font-black ${isBusy ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                                    {branch.currentLoad} <span className="text-xs text-zinc-400">/ {branch.maxCapacity}</span>
                                  </span>
                               </div>
                               <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(loadPct, 100)}%` }}
                                    className={`h-full rounded-full ${isBusy ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                  />
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                    );
                 })}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="incentives"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 underline decoration-indigo-500/20 underline-offset-8">
                     Incentive Store
                   </h2>
                   <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Manage rewards used to redistribute network load.</p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-indigo-600/20">
                   <Plus className="w-4 h-4" /> Issue New Voucher
                </Button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {incentives.map((inc) => (
                   <Card key={inc.id} className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-8">
                         <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer" onClick={() => handleDeleteIncentive(inc.id)}>
                            <Trash2 className="w-5 h-5" />
                         </div>
                      </div>
                      <CardHeader className="p-10 pb-6 pr-24">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                               <Ticket className="w-8 h-8" />
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Voucher</div>
                               <CardTitle className="text-3xl font-black tracking-tighter uppercase">{inc.code}</CardTitle>
                            </div>
                         </div>
                         <p className="text-sm font-bold text-zinc-500 italic">"{inc.description || 'Generic load-redistribution reward node.'}"</p>
                      </CardHeader>
                      <CardContent className="p-10 pt-0">
                         <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl">
                            <div>
                               <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Value Magnitude</div>
                               <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                                 {inc.discountVal}{inc.isPercentage ? '%' : 'K'} OFF
                               </div>
                            </div>
                            <div className="flex flex-col items-end">
                               <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Status</div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                  <Sparkles className="w-3 h-3 fill-emerald-500/20 text-emerald-500" /> Live on Network
                               </div>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                ))}
                
                {incentives.length === 0 && (
                   <div className="col-span-full py-40 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                      <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl mb-6">
                         <Ticket className="w-12 h-12 text-zinc-300" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Voucher Store Empty</h3>
                      <p className="text-zinc-500 mt-2 font-medium">Issue incentives to start load balancing effectively.</p>
                   </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
