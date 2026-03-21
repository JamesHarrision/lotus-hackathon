import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { apiClient } from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  Ticket, 
  History, 
  ChevronRight, 
  MapPin, 
  ArrowRightLeft,
  Calendar,
  Zap,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface RoutingHistory {
  id: number;
  fromBranch: { name: string };
  toBranch: { name: string };
  status: string;
  incentiveGiven: string | null;
  estimatedWaitTime: number | null;
  createdAt: string;
}

const Profile = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [history, setHistory] = useState<RoutingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const { data } = await apiClient.get(`/routings/user/${user.id}`);
        setHistory(data.data || []);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const vouchers = history.filter(h => h.incentiveGiven);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 pb-20">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/home")}>
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">YOGO</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/home")} className="rounded-full border-zinc-200 dark:border-zinc-800">
          Back to Map
        </Button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* User Card */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-indigo-500/5"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 border-4 border-white dark:border-zinc-800 shadow-xl">
                <UserIcon className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter">{user?.name || "User Name"}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-6">{user?.email}</p>
              
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                <Star className="w-3 h-3 fill-indigo-500" /> Premium Member
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Total Vouchers</span>
                </div>
                <span className="text-lg font-black">{vouchers.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <History className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Smart Routings</span>
                </div>
                <span className="text-lg font-black">{history.length}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vouchers & History */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                <Ticket className="w-5 h-5 text-indigo-500" /> My Vouchers
              </h3>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 ml-6 opacity-50" />
            </div>

            {vouchers.length === 0 ? (
              <div className="p-12 text-center rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 opacity-50">
                <p className="text-zinc-500 font-medium">No vouchers awarded yet. Use AI routing to get smart incentives!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vouchers.map((v, i) => (
                  <motion.div
                    key={v.id}
                    layoutId={`voucher-${v.id}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group h-full"
                  >
                    <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 overflow-hidden h-full flex flex-col justify-between">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Zap className="w-5 h-5 fill-white" />
                          </div>
                          <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] font-black">ACTIVE</Badge>
                        </div>
                        <h4 className="text-xl font-black tracking-tight mb-2 uppercase">{v.incentiveGiven}</h4>
                        <p className="text-indigo-100/70 text-xs font-medium line-clamp-2">
                          Special reward for following smart diversion to {v.toBranch.name}.
                        </p>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Expires</span>
                            <span className="text-xs font-bold">31 Dec 2025</span>
                         </div>
                         <Button size="sm" className="bg-white text-indigo-600 hover:bg-white/90 font-black rounded-lg">USE NOW</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6 pt-8">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                <History className="w-5 h-5 text-indigo-500" /> Activity History
              </h3>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 ml-6 opacity-50" />
            </div>

            <div className="space-y-4">
              {history.map((h, i) => (
                <div 
                  key={h.id}
                  className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800">
                      <ArrowRightLeft className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400">{h.fromBranch.name}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-300" />
                        <span className="text-sm font-black uppercase text-indigo-600 dark:text-indigo-400">{h.toBranch.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(h.createdAt).toLocaleDateString()}</span>
                        {h.estimatedWaitTime && <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> {h.estimatedWaitTime}m saved</span>}
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {h.incentiveGiven && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                        <Ticket className="w-3 h-3" /> REWARDED
                      </div>
                    )}
                    <Badge className={h.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-zinc-500'}>
                      {h.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="text-center py-20 text-zinc-400 font-medium italic">
                  No activity history found yet.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
