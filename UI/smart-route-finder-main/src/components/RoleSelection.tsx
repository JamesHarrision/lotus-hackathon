import { MapPin, Building2 } from "lucide-react";
import type { UserRole } from "@/pages/Index";
import ThemeToggle from "@/components/ThemeToggle";
import { AuroraBackground } from "@/components/ui/aurora-background";

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelection = ({ onSelect }: RoleSelectionProps) => {
  return (
    <AuroraBackground className="min-h-screen h-auto">
      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="text-center mb-12 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <MapPin className="w-4 h-4" />
            Smart Routing
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Visitor Flow Manager
          </h1>
          <p className="text-muted-foreground text-lg">
            Intelligent routing to reduce congestion and optimize visitor experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
          <button
            onClick={() => onSelect("visitor")}
            className="role-card group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">I'm a Visitor</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get routed to the nearest available branch with the shortest wait time.
            </p>
          </button>

          <button
            onClick={() => onSelect("enterprise")}
            className="role-card group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
              <Building2 className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">I'm an Enterprise</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Register your branches, set capacity limits, and connect CCTV feeds.
            </p>
          </button>
        </div>

        <p className="text-muted-foreground text-xs mt-10">
          Powered by OpenRouteService & YOLO v26 detection
        </p>
      </div>
    </AuroraBackground>
  );
};

export default RoleSelection;
