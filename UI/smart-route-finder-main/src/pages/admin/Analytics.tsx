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
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
           <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            AI Analytics & Insights
          </h1>
          <p className="text-zinc-500 font-medium mt-1">Measuring routing optimization and system impact.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 rounded-full flex items-center gap-2 text-blue-600 font-bold text-sm">
           <Zap className="w-4 h-4 fill-blue-600" /> Smart Monitoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Redirects</CardDescription>
            <CardTitle className="text-3xl font-black">1,402</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                <TrendingUp className="w-4 h-4" /> +12% from last week
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Algorithm Accuracy</CardDescription>
            <CardTitle className="text-3xl font-black">94.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-blue-500 font-bold text-sm">
                <BrainCircuit className="w-4 h-4" /> High confidence rating
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Incentives</CardDescription>
            <CardTitle className="text-3xl font-black">485</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Award className="w-4 h-4" /> Issued today
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Line Chart: Redirects Over Time */}
        <Card className="rounded-2xl border-zinc-200/50 shadow-xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-xl font-bold">Traffic Redistribution</CardTitle>
            <CardDescription>Daily redirected customers via AI recommendations</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={redirectData}>
                <defs>
                  <linearGradient id="colorRedirected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="redirected" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRedirected)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Incentive Redemptions */}
        <Card className="rounded-2xl border-zinc-200/50 shadow-xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-xl font-bold">Incentive Performance</CardTitle>
            <CardDescription>Coupons issued vs successfully redeemed by branch</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incentiveData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="top" align="right" height={36}/>
                <Bar dataKey="issued" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="redeemed" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
