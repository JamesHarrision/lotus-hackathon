import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { apiClient } from "../lib/axios";
import { useAppStore, BranchLoadData } from "../store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, Navigation } from "lucide-react";
import { useDemoSimulation } from "../hooks/useDemoSimulation";

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

// Subcomponent to handle auto-focusing the map
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
  const { branches: liveBranches, updateBranchLoad } = useAppStore();

  // Activate Demo Mode Simulation for this enterprise's branches
  useDemoSimulation(true);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation denied", err)
      );
    }

    const fetchDetails = async () => {
      try {
        const [entRes, branchRes] = await Promise.all([
          apiClient.get(`/enterprises/${id}`),
          apiClient.get(`/branches?enterpriseId=${id}`)
        ]);
        setEnterpriseName(entRes.data.data.name);
        setBranches(branchRes.data.data);

        // Pre-fill Zustand with static branch info so demo simulator can pick them up
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
      }
    };
    fetchDetails();
  }, [id, updateBranchLoad]);

  // Combine static branch data with live socket data
  const mergedBranches = branches.map(b => {
    const liveData = liveBranches[b.id] as BranchLoadData | undefined;
    if (liveData) {
      return { ...b, currentLoad: liveData.currentLoad, maxCapacity: liveData.maxCapacity };
    }
    return b;
  });

  // Calculate generic distance in km
  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); 
  };

  const center: [number, number] = mergedBranches.length > 0 
    ? [mergedBranches[0].lat, mergedBranches[0].lng] 
    : [21.0285, 105.8542];

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 shadow-sm z-10 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/home')} className="rounded-full shadow-sm hover:bg-zinc-100">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {enterpriseName || "Loading..."}
            </h1>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Live Status Overview</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative">
        {/* Map Area */}
        <div className="w-full md:w-[65%] h-[40vh] md:h-full relative z-0 shadow-inner">
          <MapContainer center={center} zoom={13} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {userLoc && (
              <Marker position={[userLoc.lat, userLoc.lng]}>
                <Popup className="rounded-xl shadow-lg font-medium">You are here</Popup>
              </Marker>
            )}
            {mergedBranches.map((branch) => {
              const loadPct = branch.maxCapacity > 0 ? (branch.currentLoad / branch.maxCapacity) * 100 : 0;
              let dotColor = "bg-emerald-500";
              let textColor = "text-emerald-600";
              if (loadPct > 80) {
                dotColor = "bg-rose-500";
                textColor = "text-rose-600";
              } else if (loadPct > 50) {
                dotColor = "bg-amber-500";
                textColor = "text-amber-600";
              }

              return (
                <Marker key={branch.id} position={[branch.lat, branch.lng]}>
                  <Popup className="rounded-2xl shadow-xl border-0 p-0 overflow-hidden">
                    <div className="p-3">
                      <div className="font-bold text-base mb-1">{branch.name}</div>
                      <div className="text-xs text-zinc-500 mb-3">{branch.address}</div>
                      <div className="flex items-center gap-2 text-sm font-medium bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-100">
                        <span className="relative flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`}></span>
                        </span>
                        <span className={textColor}>{branch.currentLoad} / {branch.maxCapacity} Visitors</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            <AutofitBoundaries branches={mergedBranches} userLoc={userLoc} />
          </MapContainer>

          {/* Map Overlay Gradient */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-[400] hidden md:block" />
        </div>

        {/* List Area */}
        <div className="w-full md:w-[35%] h-[60vh] md:h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-4 space-y-4 shadow-xl z-10 custom-scrollbar">
          
          <div className="sticky top-0 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md pb-2 z-20 pt-2">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Nearest Branches
            </h2>
          </div>

          <div className="space-y-4 pb-12 transition-all duration-300">
            {mergedBranches.map((branch) => {
              const dist = userLoc ? calcDistance(userLoc.lat, userLoc.lng, branch.lat, branch.lng) : null;
              const estTime = dist ? Math.round((dist / 40) * 60) : null; 
              
              const loadPct = branch.maxCapacity > 0 ? (branch.currentLoad / branch.maxCapacity) * 100 : 0;
              let statusColor = "bg-emerald-500";
              let textColor = "text-emerald-600";
              let barColor = "bg-emerald-500";
              
              if (loadPct > 80) {
                statusColor = "bg-rose-500";
                textColor = "text-rose-600";
                barColor = "bg-rose-500";
              } else if (loadPct > 50) {
                statusColor = "bg-amber-500";
                textColor = "text-amber-600";
                barColor = "bg-amber-500";
              }

              return (
                <Card key={branch.id} className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl group overflow-hidden">
                  <div className={`h-1 w-full ${barColor} opacity-80`} style={{ width: `${Math.min(loadPct, 100)}%`, transition: 'width 0.5s ease-in-out' }} />
                  <CardHeader className="p-4 pb-2 relative">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">{branch.name}</CardTitle>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2 pr-8">{branch.address}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 text-sm">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">Live Load</span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <Users className={`w-3.5 h-3.5 ${textColor}`} />
                          <span className={`${textColor} text-sm`}>
                            {branch.currentLoad} <span className="text-zinc-400 font-medium">/ {branch.maxCapacity}</span>
                          </span>
                        </div>
                      </div>
                      
                      {estTime !== null ? (
                        <div className="flex flex-col bg-primary/5 p-2.5 rounded-lg border border-primary/10">
                          <span className="text-[10px] text-primary/70 font-semibold uppercase tracking-wider mb-1">Distance</span>
                          <div className="flex items-center gap-1.5 font-bold text-primary">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-sm">{estTime} min</span>
                          </div>
                          <span className="text-[10px] text-primary/60 mt-0.5 ml-5">{dist?.toFixed(1)} km away</span>
                        </div>
                      ) : (
                        <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/50 justify-center">
                          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">Status</span>
                          <span className="text-xs font-medium text-zinc-500">Location Unknown</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDetails;
