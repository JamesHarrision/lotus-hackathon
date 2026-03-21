import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Building2, ChevronRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Enterprise {
  id: number;
  name: string;
  _count?: {
    branches: number;
  };
}

const Home = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const { data } = await apiClient.get("/enterprises");
        setEnterprises(data.data || []);
      } catch (error) {
        console.error("Failed to fetch enterprises", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnterprises();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-primary/20">
      
      {/* Hero Header Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="container mx-auto py-16 px-4 max-w-6xl relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Discover Available <span className="text-primary bg-primary/10 px-2 rounded-lg">Enterprises</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Select an enterprise below to view branch locations, real-time capacities, and find the fastest route to your destination.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/login')} 
            className="rounded-full shadow-md hover:shadow-lg transition-all h-12 px-6"
          >
            Switch Account <LogIn className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 max-w-6xl">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <Card key={i} className="animate-pulse h-56 bg-white dark:bg-zinc-900 border-zinc-200/50 rounded-2xl shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterprises.map((ent) => (
              <Card 
                key={ent.id} 
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/enterprise/${ent.id}`)}
              >
                {/* Decorative Top Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                      <Building2 className="h-7 w-7" />
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full flex items-center text-xs font-bold text-zinc-500">
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {ent._count?.branches || 0} Locations
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors tracking-tight">
                    {ent.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-2">
                  <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 line-clamp-2">
                    Access real-time capacity and routing insights for {ent.name} branches network-wide.
                  </CardDescription>
                  
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex w-full items-center justify-between text-sm font-bold text-zinc-400 group-hover:text-primary transition-colors">
                    <span>Explore Network</span>
                    <div className="p-2 rounded-full bg-zinc-50 dark:bg-zinc-950 group-hover:bg-primary/10 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {enterprises.length === 0 && (
              <div className="col-span-full py-24 text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-dashed">
                <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 mb-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No Enterprises Found</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mt-2">
                  There are currently no enterprises available in the system. They might be setting up.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
