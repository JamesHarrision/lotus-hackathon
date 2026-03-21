import { useState, useEffect } from "react";
import { apiClient } from "../../lib/axios";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Search, Clock, Zap, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { TableRowSkeleton, MetricSkeleton } from "@/components/SkeletonLoader";

interface Log {
  id: number;
  user: { name: string; email: string };
  fromBranch: { name: string };
  toBranch: { name: string };
  status: string;
  calculatedCost: number;
  incentiveGiven: string;
  createdAt: string;
}

const SuperAdminLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/routings");
        setLogs(data.data || []);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.toBranch.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'REJECTED': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      default: return 'bg-zinc-500/10 text-zinc-600 border-zinc-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30">
               <ScrollText className="w-8 h-8" />
             </div>
             System Audit Hub
          </h1>
          <p className="text-zinc-500 font-medium mt-2 max-w-md">Global telemetry and algorithmic transparency log for all routing operations.</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search routing history..." 
            className="pl-12 h-14 rounded-2xl border-none shadow-xl bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? [1,2,3].map(i => <MetricSkeleton key={i} />) : (
          <>
            <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-2xl shadow-indigo-500/30 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
               <CardHeader className="pb-2">
                 <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] text-indigo-100">Avg. Algorithmic Cost</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-4xl font-black tracking-tighter">
                    {logs.length > 0 ? (logs.reduce((acc, l) => acc + (l.calculatedCost || 0), 0) / logs.length).toFixed(4) : "0.0000"}
                 </div>
                 <div className="flex items-center gap-2 mt-2 text-indigo-200/80 font-bold text-xs uppercase tracking-widest">
                    <Zap className="w-3 h-3" /> Efficiency Metric
                 </div>
               </CardContent>
            </Card>

            <Card className="bg-zinc-900 text-white border-none shadow-2xl shadow-zinc-500/10 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
               <CardHeader className="pb-2">
                 <CardTitle className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] text-zinc-300">Total Telemetry</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-4xl font-black tracking-tighter">{logs.length}</div>
                 <div className="flex items-center gap-2 mt-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                    <Activity className="w-3 h-3" /> Processed Events
                 </div>
               </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
               <CardHeader className="pb-2">
                 <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Network Hit Rate</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                    {logs.length > 0 ? Math.round((logs.filter(l => l.status === 'ACCEPTED' || l.status === 'COMPLETED').length / logs.length) * 100) : 0}%
                 </div>
                 <div className="flex items-center gap-2 mt-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                    <Zap className="w-3 h-3 text-amber-500" /> Acceptance Rate
                 </div>
               </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                <TableHead className="py-6 px-8 font-black text-zinc-400 uppercase tracking-widest text-[10px]">Date / Time</TableHead>
                <TableHead className="py-6 font-black text-zinc-400 uppercase tracking-widest text-[10px]">Involved User</TableHead>
                <TableHead className="py-6 font-black text-zinc-400 uppercase tracking-widest text-[10px]">Optimal Routing</TableHead>
                <TableHead className="py-6 font-black text-zinc-400 uppercase tracking-widest text-[10px]">Processing Cost</TableHead>
                <TableHead className="py-6 px-8 text-right font-black text-zinc-400 uppercase tracking-widest text-[10px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))
              ) : filteredLogs.map((log, idx) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={log.id} 
                  className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 border-zinc-50 dark:border-zinc-800/50 transition-all font-medium"
                >
                  <TableCell className="px-8 py-8 font-mono text-[11px] font-bold text-zinc-400">
                    <div className="flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5 opacity-50" />
                       {new Date(log.createdAt).toLocaleString(undefined, { 
                         month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                       })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{log.user.name}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">{log.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px] font-bold border border-zinc-200 dark:border-zinc-700">
                        {log.fromBranch.name}
                      </div>
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <div className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-black shadow-lg shadow-indigo-500/20">
                        {log.toBranch.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                    {log.calculatedCost?.toFixed(4)}
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <Badge variant="outline" className={`rounded-xl px-4 py-1.5 text-[10px] font-black tracking-widest uppercase border-2 ${getStatusColor(log.status)} shadow-sm`}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SuperAdminLogs;
