import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { BrainCircuit, TrendingUp, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { MetricSkeleton, CardSkeleton } from "@/components/SkeletonLoader";

// Mock Data for demonstration
const redirectData = [
  { name: "Mon", redirected: 45, load: 30 },
  { name: "Tue", redirected: 52, load: 45 },
  { name: "Wed", redirected: 38, load: 25 },
  { name: "Thu", redirected: 65, load: 55 },
  { name: "Fri", redirected: 48, load: 40 },
  { name: "Sat", redirected: 85, load: 75 },
  { name: "Sun", redirected: 72, load: 60 },
];

const incentiveData = [
  { name: "Central", issued: 120, redeemed: 95 },
  { name: "West", issued: 80, redeemed: 60 },
  { name: "East", issued: 150, redeemed: 140 },
  { name: "South", issued: 110, redeemed: 85 },
  { name: "North", issued: 90, redeemed: 70 },
];

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8 font-sans"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            AI Analytics & Insights
          </h1>
          <p className="text-zinc-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Measuring routing optimization and system impact.</p>
        </div>
        <motion.div 
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-full flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10"
        >
           <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400 animate-pulse" /> Neural Monitoring Active
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <MetricSkeleton key={i} />)
        ) : (
          <>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-2xl transition-all border-l-4 border-l-blue-500 rounded-[2rem] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Total Redirects</CardDescription>
                  <CardTitle className="text-4xl font-black tracking-tighter">1,402</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                      <TrendingUp className="w-4 h-4" /> +12% Efficiency
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-2xl transition-all border-l-4 border-l-indigo-500 rounded-[2rem] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Neural Accuracy</CardDescription>
                  <CardTitle className="text-4xl font-black tracking-tighter">94.2%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-indigo-500 font-black text-[10px] uppercase tracking-widest">
                      <BrainCircuit className="w-4 h-4" /> High Confidence
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-2xl transition-all border-l-4 border-l-amber-500 rounded-[2rem] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Total Rewards</CardDescription>
                  <CardTitle className="text-4xl font-black tracking-tighter">485</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                      <Award className="w-4 h-4" /> Issued Today
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Line Chart: Redirects Over Time */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl border border-zinc-200/50 dark:border-zinc-800/50">
                <CardHeader className="bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800 px-8 py-6">
                  <CardTitle className="text-xl font-black tracking-tight">Traffic Redistribution</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Daily redirected customers via AI recommendations</CardDescription>
                </CardHeader>
                <CardContent className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={redirectData}>
                      <defs>
                        <linearGradient id="colorRedirected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10, fontWeight: 700}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)'}} 
                        itemStyle={{fontWeight: 900, fontSize: '12px'}}
                      />
                      <Area type="monotone" dataKey="redirected" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRedirected)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bar Chart: Incentive Redemptions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl border border-zinc-200/50 dark:border-zinc-800/50">
                <CardHeader className="bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800 px-8 py-6">
                  <CardTitle className="text-xl font-black tracking-tight">Incentive Performance</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Coupons issued vs successfully redeemed by branch</CardDescription>
                </CardHeader>
                <CardContent className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incentiveData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10, fontWeight: 700}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)'}}
                        itemStyle={{fontWeight: 900, fontSize: '12px'}}
                      />
                      <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em'}}/>
                      <Bar dataKey="issued" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={20} />
                      <Bar dataKey="redeemed" fill="#10b981" radius={[10, 10, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Analytics;
