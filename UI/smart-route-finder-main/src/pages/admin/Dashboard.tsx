import { useState, useEffect } from "react";
import { useAppStore, BranchLoadData } from "../../store/useAppStore";
import { apiClient } from "../../lib/axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Activity, Users, Building, AlertCircle } from "lucide-react";
import { useDemoSimulation } from "../../hooks/useDemoSimulation";

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 bg-clip-text text-transparent tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Manage and track your branches in real-time.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Total Branches</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{branches.length}</div>
            <p className="text-xs text-zinc-500 mt-1 font-medium text-emerald-500">+ Active routing network</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Live Visitors</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{totalLoad} <span className="text-xl text-zinc-400">/ {totalCapacity}</span></div>
            <p className="text-xs text-zinc-500 mt-1 font-medium">System aggregate capacity</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Network Load</CardTitle>
            <div className={`p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 ${networkLoadPct > 80 ? 'bg-rose-500/10' : ''}`}>
              <Activity className={`h-5 w-5 ${networkColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-black ${networkColor}`}>
              {networkLoadPct}%
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-medium">Real-time load index</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search by branch name or address..." 
          className="pl-10 py-6 text-base bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl focus-visible:ring-primary/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Card key={i} className="animate-pulse h-48 bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBranches.map(branch => {
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
              <Card key={branch.id} className="group overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 pointer-events-auto">
                {/* Top Status Border line */}
                <div className={`h-1.5 w-full ${statusColor}`} />
                
                <CardHeader className="pb-4 relative">
                  <div className="flex justify-between items-start">
                    <div className="pr-8">
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{branch.name}</CardTitle>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 h-8 leading-relaxed font-medium">
                        {branch.address}
                      </p>
                    </div>
                    {/* Pulsing indicator */}
                    <div className={`absolute top-4 right-4 p-2 rounded-xl ${bgColor} ${borderColor} border flex items-center justify-center`}>
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
                  <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        Live Load
                      </span>
                      <div className="flex flex-col items-end">
                        <span className={`font-black text-2xl leading-none ${textColor}`}>
                          {branch.currentLoad}
                        </span>
                        <span className="text-xs font-medium text-zinc-400 mt-1">/ {branch.maxCapacity} MAX</span>
                      </div>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative shadow-inner">
                      <div 
                        className={`h-full ${statusColor} rounded-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] relative`}
                        style={{ width: `${Math.min(loadPct, 100)}%` }}
                      >
                        {/* Shimmer effect inside the bar line */}
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                    
                    {loadPct > 80 && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-rose-500">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Critically High Traffic!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredBranches.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
              <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                <Search className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold">No branches found</h3>
              <p className="text-zinc-500 mt-1">Try adjusting your search criteria or adding new branches.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
