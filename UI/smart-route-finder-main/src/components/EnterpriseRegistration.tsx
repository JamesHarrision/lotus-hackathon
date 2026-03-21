import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ArrowLeft, Plus, Trash2, Building2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Branch {
  id: string;
  location: string;
  capacity: string;
  rtspLinks: string[];
}

interface EnterpriseRegistrationProps {
  onBack: () => void;
}

const createBranch = (): Branch => ({
  id: crypto.randomUUID(),
  location: "",
  capacity: "",
  rtspLinks: [""],
});

const EnterpriseRegistration = ({ onBack }: EnterpriseRegistrationProps) => {
  const [companyName, setCompanyName] = useState("");
  const [branches, setBranches] = useState<Branch[]>([createBranch()]);
  const [submitted, setSubmitted] = useState(false);

  const updateBranch = (id: string, field: "location" | "capacity", value: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const updateRtspLink = (branchId: string, linkIndex: number, value: string) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === branchId
          ? { ...b, rtspLinks: b.rtspLinks.map((l, i) => (i === linkIndex ? value : l)) }
          : b
      )
    );
  };

  const addRtspLink = (branchId: string) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === branchId ? { ...b, rtspLinks: [...b.rtspLinks, ""] } : b
      )
    );
  };

  const removeRtspLink = (branchId: string, linkIndex: number) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === branchId && b.rtspLinks.length > 1
          ? { ...b, rtspLinks: b.rtspLinks.filter((_, i) => i !== linkIndex) }
          : b
      )
    );
  };

  const addBranch = () => {
    setBranches((prev) => [...prev, createBranch()]);
  };

  const removeBranch = (id: string) => {
    if (branches.length <= 1) return;
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Please enter your company name.");
      return;
    }

    const incomplete = branches.some(
      (b) => !b.location.trim() || !b.capacity.trim() || (b.rtspLinks || [""]).some((l) => !l.trim())
    );
    if (incomplete) {
      toast.error("Please fill out all branch details.");
      return;
    }

    setSubmitted(true);
    toast.success("Enterprise registered successfully!");
  };

  if (submitted) {
    return (
      <AuroraBackground className="min-h-screen h-auto">
        <div className="relative z-10 flex flex-col items-center justify-center px-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Registration Complete</h2>
          <p className="text-muted-foreground text-center max-w-sm mb-8">
            <span className="font-medium text-foreground">{companyName}</span> has been registered
            with {branches.length} branch{branches.length > 1 ? "es" : ""}. The system will begin
            monitoring capacity via your CCTV feeds.
          </p>
          <Button variant="outline" onClick={onBack}>
            Back to Home
          </Button>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="min-h-screen h-auto items-start">
      <div className="relative z-10 min-h-screen flex flex-col w-full">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Enterprise Registration</h1>
          <p className="text-xs text-muted-foreground">Register your company and branches</p>
        </div>
        <ThemeToggle />
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          {/* Company Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Company Information</h2>
                <p className="text-xs text-muted-foreground">Basic details about your enterprise</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g. Acme Corporation"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Total Branches</Label>
              <div className="h-10 px-3 flex items-center rounded-md border bg-muted text-sm text-muted-foreground">
                {branches.length} branch{branches.length > 1 ? "es" : ""}
              </div>
            </div>
          </section>

          {/* Branches */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Branch Details</h2>
              <Button type="button" variant="outline" size="sm" onClick={addBranch}>
                <Plus className="w-4 h-4 mr-1" />
                Add Branch
              </Button>
            </div>

            <div className="space-y-4">
              {branches.map((branch, index) => (
                <div
                  key={branch.id}
                  className="bg-card border rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Branch {index + 1}
                    </span>
                    {branches.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeBranch(branch.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="Address or coordinates"
                        value={branch.location}
                        onChange={(e) =>
                          updateBranch(branch.id, "location", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Max visitors"
                        value={branch.capacity}
                        onChange={(e) =>
                          updateBranch(branch.id, "capacity", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>RTSP Camera Links</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-accent"
                        onClick={() => addRtspLink(branch.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Camera
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(branch.rtspLinks || [""]).map((link, linkIndex) => (
                        <div key={linkIndex} className="flex gap-2">
                          <Input
                            placeholder={`rtsp://camera-feed-${linkIndex + 1}`}
                            value={link}
                            onChange={(e) =>
                              updateRtspLink(branch.id, linkIndex, e.target.value)
                            }
                          />
                          {(branch.rtspLinks || []).length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeRtspLink(branch.id, linkIndex)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Submit */}
        <div className="sticky bottom-0 bg-card border-t px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Register Enterprise
            </Button>
          </div>
        </div>
      </form>
    </div>
    </AuroraBackground>
  );
};

export default EnterpriseRegistration;
