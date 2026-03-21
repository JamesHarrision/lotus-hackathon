import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { apiClient } from "../lib/axios";
import { useAppStore, BranchLoadData } from "../store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, Navigation, Zap, Target } from "lucide-react";
import { useDemoSimulation } from "../hooks/useDemoSimulation";
import { CardSkeleton } from "@/components/SkeletonLoader";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Gift, MapPin as MapPinIcon, CheckCircle2, Activity, BrainCircuit, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Branch {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  currentLoad: number;
  maxCapacity: number;
}

const AutofitBoundaries = ({ branches, userLoc }: { branches: Branch[], userLoc: { lat: number, lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (branches.length === 0 && !userLoc) return;

    const bounds = L.latLngBounds([]);
    if (userLoc) {
      bounds.extend([userLoc.lat, userLoc.lng]);
    }
    branches.forEach(b => {
      bounds.extend([b.lat, b.lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [branches, userLoc, map]);

  return null;
};

const EnterpriseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [enterpriseName, setEnterpriseName] = useState("");
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const { branches: liveBranches, updateBranchLoad, user: authUser } = useAppStore();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isRecommendLoading, setIsRecommendLoading] = useState(false);
  const { toast } = useToast();

  // useDemoSimulation(true);

  useEffect(() => {
    const DEFAULT_LOC = { lat: 21.0285, lng: 105.8542 }; // Hanoi Center

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.warn("Geolocation denied, using default fallback.", err);
          setUserLoc(DEFAULT_LOC);
          toast({ 
            title: "Simulated Location", 
            description: "Using default coordinates (Hanoi) as GPS access was restricted.",
          });
        }
      );
    } else {
      setUserLoc(DEFAULT_LOC);
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [entRes, branchRes] = await Promise.all([
          apiClient.get(`/enterprises/${id}`),
          apiClient.get(`/branches?enterpriseId=${id}`)
        ]);
        setEnterpriseName(entRes.data.data.name);
        setBranches(branchRes.data.data);

        branchRes.data.data.forEach((b: Branch) => {
          updateBranchLoad({
            branchId: b.id,
            currentLoad: b.currentLoad,
            maxCapacity: b.maxCapacity,
            loadPercentage: Math.round((b.currentLoad / b.maxCapacity) * 10000) / 100
          });
        });

      } catch (error) {
        console.error("Failed to fetch enterprise details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, updateBranchLoad]);

  const mergedBranches = branches.map(b => {
    const liveData = liveBranches[b.id] as BranchLoadData | undefined;
    if (liveData) {
      return { ...b, currentLoad: liveData.currentLoad, maxCapacity: liveData.maxCapacity };
    }
    return b;
  });

  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); 
  };

  const center: [number, number] = mergedBranches.length > 0 
    ? [mergedBranches[0].lat, mergedBranches[0].lng] 
    : [21.0285, 105.8542];

  // Sorting logic for smartest route
  const sortedBranches = [...mergedBranches].sort((a, b) => {
    const da = userLoc ? calcDistance(userLoc.lat, userLoc.lng, a.lat, a.lng) : 0;
    const db = userLoc ? calcDistance(userLoc.lat, userLoc.lng, b.lat, b.lng) : 0;
    
    const la = a.currentLoad / a.maxCapacity;
    const lb = b.currentLoad / b.maxCapacity;

    // Smart Score: Distance (70%) + Load (30%)
    return (da * 0.7 + la * 10) - (db * 0.7 + lb * 10);
  });

  const handleRecommend = async (branchId: number) => {
    console.log("handleRecommend triggered for branch:", branchId);
    if (!userLoc) {
      console.warn("User location missing!");
      toast({ title: "Location Required", description: "Please enable geolocation to use smart routing.", variant: "destructive" });
      return;
    }

    try {
      setIsRecommendLoading(true);
      const { data: res } = await apiClient.post("/routings/recommend", {
        userId: authUser?.id || 1,
        enterpriseId: parseInt(id!),
        lat: userLoc.lat,
        lng: userLoc.lng,
        currentBranchId: branchId
      });

      console.log("Recommend response:", res);
      setRecommendation(res.data);
      toast({ title: "AI Route Ready", description: "Neural engine has generated an optimal path." });
    } catch (err: any) {
      console.error("Recommend error:", err);
      toast({ 
        title: "Routing Error", 
        description: err.response?.data?.message || "AI Service unreachable.", 
        variant: "destructive" 
      });
    } finally {
      setIsRecommendLoading(false);
    }
  };

  const handleUpdateRoutingStatus = async (routingId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await apiClient.patch(`/routings/${routingId}/status`, { status });
      setRecommendation(null);
      toast({ 
        title: status === 'ACCEPTED' ? "Directive Accepted" : "Route Declined", 
        description: status === 'ACCEPTED' ? "Your choice has been synchronized with the AI engine." : "Proceeding with original choice.",
      });
    } catch (err: any) {
      console.error("Update status error:", err);
      toast({ 
        title: "Sync Error", 
        description: "Failed to update choice status.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 font-sans"
    >
      <AnimatePresence>
        {isRecommendLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center flex-col gap-6"
          >
             <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl animate-pulse opacity-20" />
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
             </div>
             <div className="text-center">
                <p className="text-xl font-black text-white uppercase tracking-tighter mb-2">Calculating Optimal Route</p>
                <div className="flex items-center gap-2 justify-center">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="p-6 bg-white/90 backdrop-blur-2xl dark:bg-zinc-900/90 shadow-2xl z-20 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0"
      >
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/home')} 
            className="rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors h-12 w-12"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent tracking-tighter uppercase">
              {enterpriseName || "SYNCING..."}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] text-zinc-400 font-black tracking-[0.2em] uppercase">NEURAL LINK ACTIVE</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Network Load</span>
             <span className="text-sm font-black text-indigo-500">OPTIMAL</span>
           </div>
           <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600">
             <Zap className="w-5 h-5 fill-indigo-600" />
           </div>
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative">
        {/* Map Area */}
        <div className="w-full md:w-[60%] lg:w-[65%] h-[45vh] md:h-full relative z-0">
          <MapContainer center={center} zoom={13} className="h-full w-full grayscale-[0.2] dark:invert dark:hue-rotate-180">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {userLoc && (
              <Marker position={[userLoc.lat, userLoc.lng]}>
                <Popup className="rounded-2xl shadow-2xl font-black overflow-hidden border-none text-[10px] uppercase">User Identity Located</Popup>
              </Marker>
            )}
            {mergedBranches.map((branch) => {
              const loadPct = branch.maxCapacity > 0 ? (branch.currentLoad / branch.maxCapacity) * 100 : 0;
              let dotColor = "bg-emerald-500";
              if (loadPct > 80) dotColor = "bg-rose-500";
              else if (loadPct > 50) dotColor = "bg-amber-500";

              return (
                <Marker key={branch.id} position={[branch.lat, branch.lng]}>
                  <Popup className="custom-popup">
                    <div className="p-4 min-w-[200px]">
                      <div className="font-black text-lg tracking-tight mb-1 uppercase">{branch.name}</div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-4">{branch.address}</div>
                      <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-100 shadow-inner">
                        <div className={`w-3 h-3 rounded-full ${dotColor} animate-pulse shadow-lg`} />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
                          {branch.currentLoad} <span className="text-zinc-400">/ {branch.maxCapacity} Load</span>
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            <AutofitBoundaries branches={mergedBranches} userLoc={userLoc} />
          </MapContainer>
        </div>

        {/* List Area */}
        <div className="w-full md:w-[40%] lg:w-[35%] h-[55vh] md:h-full overflow-y-auto bg-white dark:bg-zinc-900 border-l border-zinc-200/50 dark:border-zinc-800/50 custom-scrollbar relative">
          
          <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-8 z-20 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-black text-2xl tracking-tighter flex items-center gap-3 uppercase">
                 <Target className="w-6 h-6 text-indigo-600" />
                 Smart Directives
               </h2>
               <div className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30">
                 AI Optimized
               </div>
            </div>
            
            <Button 
               onClick={() => handleRecommend(sortedBranches[0]?.id)}
               disabled={isRecommendLoading || sortedBranches.length === 0}
               className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-500/20 border-none group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center gap-3 relative z-10">
                  <BrainCircuit className="w-6 h-6 animate-bounce" />
                  <div className="flex flex-col items-start leading-none">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-1">Neural Recommendation</span>
                     <span className="text-sm font-black uppercase tracking-tighter">Auto-Intelligence Mode</span>
                  </div>
               </div>
            </Button>
            
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Predictive latency & load analysis active
            </p>
          </div>

          <div className="p-6 space-y-6 pb-24">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            ) : sortedBranches.map((branch, idx) => {
              const dist = userLoc ? calcDistance(userLoc.lat, userLoc.lng, branch.lat, branch.lng) : null;
              const estTime = dist ? Math.round((dist / 30) * 60) : null; 
              const loadPct = branch.maxCapacity > 0 ? (branch.currentLoad / branch.maxCapacity) * 100 : 0;
              
              let statusBorder = "border-emerald-500/20";
              let textColor = "text-emerald-600";
              let bgGlow = "hover:shadow-emerald-500/5";
              
              if (loadPct > 80) {
                statusBorder = "border-rose-500/20";
                textColor = "text-rose-600";
                bgGlow = "hover:shadow-rose-500/5";
              } else if (loadPct > 50) {
                statusBorder = "border-amber-500/20";
                textColor = "text-amber-600";
                bgGlow = "hover:shadow-amber-500/5";
              }

              return (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={branch.id}
                >
                  <Card className={`relative border-none shadow-xl bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-white dark:hover:bg-zinc-800/80 rounded-[2rem] transition-all duration-500 group overflow-hidden ${bgGlow}`}>
                    {idx === 0 && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
                    )}
                    
                    <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-start">
                        <div className="max-w-[70%]">
                          <CardTitle className="text-xl font-black group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-none mb-2">{branch.name}</CardTitle>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest line-clamp-1">{branch.address}</p>
                        </div>
                        {idx === 0 && (
                           <div className="px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">RECOMMENDED</div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-8 pb-8 pt-0">
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className={`p-4 rounded-2xl bg-white dark:bg-zinc-900 border ${statusBorder} shadow-inner`}>
                          <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block mb-2">Live Load</span>
                          <div className="flex items-center gap-2">
                             <Users className={`w-4 h-4 ${textColor}`} />
                             <span className={`text-xl font-black ${textColor} tracking-tighter`}>{branch.currentLoad}</span>
                             <span className="text-[10px] text-zinc-300 font-bold">/ {branch.maxCapacity}</span>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 border-none">
                          <span className="text-[9px] text-indigo-200 font-black uppercase tracking-widest block mb-2">Neural ETA</span>
                          <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4" />
                             <span className="text-xl font-black tracking-tighter">{estTime ? `${estTime}m` : '--'}</span>
                             <span className="text-[10px] text-indigo-300 font-bold">{dist ? `${dist.toFixed(1)}km` : ''}</span>
                          </div>
                        </div>
                      </div>

                      {/* Micro interaction link */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleRecommend(branch.id)}
                        className={`mt-6 flex items-center justify-between group/link cursor-pointer p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-600 transition-all duration-300 ${isRecommendLoading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover/link:text-white transition-colors">
                           {isRecommendLoading ? 'Calculating...' : 'Generate AI Route'}
                         </span>
                         <div className="p-2 rounded-xl bg-white dark:bg-zinc-700 group-hover/link:bg-indigo-500 group-hover/link:text-white transition-all duration-300">
                           <Navigation className="w-4 h-4" />
                         </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendation Modal */}
      <Dialog open={!!recommendation} onOpenChange={() => setRecommendation(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none bg-zinc-950 text-white shadow-2xl">
           <div className="relative p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Zap className="w-6 h-6 fill-indigo-400" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">AI Directive Ready</h2>
                    <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">Optimized Latency Path</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-6 relative">
                    <div className="flex flex-col items-center gap-1 z-10">
                       <MapPinIcon className="w-5 h-5 text-indigo-500" />
                       <div className="w-0.5 h-12 border-l-2 border-dashed border-zinc-800" />
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 space-y-8">
                       <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Departure Point</p>
                          <p className="font-bold text-sm tracking-tight">{recommendation?.fromBranch?.name || 'Current Location'}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Target Destination</p>
                          <p className="font-bold text-lg tracking-tight text-emerald-400 uppercase">{recommendation?.toBranch?.name}</p>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Est. Queue Time</p>
                       <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span className="text-xl font-black tracking-tighter">{recommendation?.estimatedWaitTime || '0'}m</span>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Algorithmic Cost</p>
                       <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-indigo-500" />
                          <span className="text-xl font-black tracking-tighter">{recommendation?.calculatedCost?.toFixed(2) || '0.00'}</span>
                       </div>
                    </div>
                 </div>

                 {recommendation?.incentiveGiven && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-6 p-6 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl shadow-indigo-600/30 relative overflow-hidden"
                    >
                       <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                       <div className="flex items-center gap-4 relative z-10">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                             <Gift className="w-6 h-6 text-white" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Reward Unlocked</p>
                             <div className="text-2xl font-black text-white tracking-tighter uppercase">{recommendation?.incentiveGiven}</div>
                          </div>
                       </div>
                       <p className="text-[10px] text-indigo-100 mt-4 font-bold italic opacity-80 uppercase tracking-wider">
                         * Show this code at {recommendation?.toBranch?.name} to redeem your load-balancing reward.
                       </p>
                    </motion.div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <Button 
                  onClick={() => handleUpdateRoutingStatus(recommendation.id, 'REJECTED')}
                  variant="outline"
                  className="h-14 rounded-2xl border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-black uppercase tracking-widest text-[10px]"
                >
                  Reject & Go Anyway
                </Button>
                <Button 
                  onClick={() => handleUpdateRoutingStatus(recommendation.id, 'ACCEPTED')}
                  className="h-14 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20"
                >
                  Accept Directive
                </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EnterpriseDetails;
