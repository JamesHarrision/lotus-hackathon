import { useState, useEffect } from "react";
import { apiClient } from "../../lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Users, Activity, Settings2, Globe, Server } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const systemData = [
  { name: "00:00", active: 120, load: 15 },
  { name: "04:00", active: 45, load: 5 },
  { name: "08:00", active: 280, load: 35 },
  { name: "12:00", active: 850, load: 92 },
  { name: "16:00", active: 720, load: 78 },
  { name: "20:00", active: 450, load: 40 },
  { name: "23:59", active: 180, load: 20 },
];

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6"];

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, enterprises: 0, branches: 0 });
  const [roleDistribution, setRoleDistribution] = useState([
    { name: "Standard Users", value: 0 },
    { name: "Enterprise Admins", value: 0 },
    { name: "System Admins", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const [usersReq, entReq, branchesReq] = await Promise.all([
          apiClient.get("/users").catch(() => ({ data: { data: [] } })),
          apiClient.get("/enterprises").catch(() => ({ data: { data: [] } })),
          apiClient.get("/branches").catch(() => ({ data: { data: [] } }))
        ]);

        const allUsers = usersReq.data?.data || [];
        const userCount = allUsers.filter((u: any) => u.role === "USER").length;
        const enterpriseCount = allUsers.filter((u: any) => u.role === "ENTERPRISE").length;
        const adminCount = allUsers.filter((u: any) => u.role === "SUPERADMIN").length;

        setStats({
          users: allUsers.length,
          enterprises: entReq.data?.data?.length || 0,
          branches: branchesReq.data?.data?.length || 0,
        });

        setRoleDistribution([
          { name: "Standard Users", value: userCount },
          { name: "Enterprise Admins", value: enterpriseCount },
          { name: "System Admins", value: adminCount },
        ]);
      } catch (error) {
        console.error("Failed to fetch super admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-purple-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-500">Global System Control</span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-br from-purple-900 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
            System Overview
          </h1>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl flex items-center gap-2 text-emerald-600 font-bold text-sm">
             <Server className="w-4 h-4" /> All Clusters Online
           </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Card key={i} className="animate-pulse h-32 bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-purple-100 dark:border-purple-900/30 shadow-lg shadow-purple-500/5 hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Users</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{stats.users}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-indigo-100 dark:border-indigo-900/30 shadow-lg shadow-indigo-500/5 hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Enterprises</CardTitle>
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{stats.enterprises}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-blue-100 dark:border-blue-900/30 shadow-lg shadow-blue-500/5 hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Network Nodes (Branches)</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{stats.branches}</div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-zinc-200/50 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">System Traffic Trend</CardTitle>
            <CardDescription>24-hour heat map of active sessions across the network</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={systemData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#8b5cf6" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-zinc-200/50 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Role Distribution</CardTitle>
            <CardDescription>Breakdown of account types in the system</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
               {roleDistribution.map((r, i) => (
                 <div key={r.name} className="flex items-center gap-2 text-xs font-medium">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                    <span>{r.name}</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;

