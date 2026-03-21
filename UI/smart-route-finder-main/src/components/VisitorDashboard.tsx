import { ArrowLeft, Navigation, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

interface VisitorDashboardProps {
  onBack: () => void;
}

const VisitorDashboard = ({ onBack }: VisitorDashboardProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Visitor Mode</h1>
          <p className="text-xs text-muted-foreground">Find the nearest available branch</p>
        </div>
        <ThemeToggle />
      </header>

      {/* Map placeholder */}
      <div className="flex-1 bg-muted flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Cpath%20d%3D%22M0%200h60v60H0z%22%20fill%3D%22none%22%20stroke%3D%22%23e5e5e5%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="text-center z-10">
          <Navigation className="w-12 h-12 text-accent mx-auto mb-4" />
          <p className="text-foreground font-medium text-lg mb-1">Map View Coming Soon</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            This area will display an interactive map with branch locations, routes, and real-time congestion data.
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="bg-card border-t p-4">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Smart Routing</p>
              <p className="text-xs text-muted-foreground">Auto-redirected if a branch is full</p>
            </div>
          </div>
          <div className="bg-muted rounded-xl p-4 flex items-start gap-3">
            <Users className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Live Capacity</p>
              <p className="text-xs text-muted-foreground">Real-time crowd detection via CCTV</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;
