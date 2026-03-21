import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ArrowLeft, Plus, Trash2, Building2, Check, X, Camera, MapPin, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Branch {
  id: string;
  name: string;
  location: string;
  capacity: string;
  rtspLinks: string[];
}

interface EnterpriseRegistrationProps {
  onBack: () => void;
}

const createBranch = (index: number): Branch => ({
  id: crypto.randomUUID(),
  name: `Branch #${index + 1}`,
  location: "",
  capacity: "50",
  rtspLinks: [""],
});

const EnterpriseRegistration = ({ onBack }: EnterpriseRegistrationProps) => {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [branches, setBranches] = useState<Branch[]>([createBranch(0)]);
  const [submitted, setSubmitted] = useState(false);

  const updateBranch = (id: string, field: keyof Branch, value: any) => {
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
    setBranches((prev) => [...prev, createBranch(prev.length)]);
  };

  const removeBranch = (id: string) => {
    if (branches.length <= 1) return;
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleNext = () => {
    if (step === 1 && !companyName.trim()) {
      toast.error("Please enter your company name.");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomplete = branches.some(
      (b) => !b.location.trim() || !b.capacity.trim()
    );
    if (incomplete) {
      toast.error("Please fill out all branch details.");
      return;
    }
    setSubmitted(true);
    toast.success("Enterprise platform initialized!");
  };

  if (submitted) {
    return (
      <AuroraBackground className="min-h-screen h-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center justify-center px-4"
        >
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-8 relative">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-accent rounded-full"
            />
            <Check className="w-10 h-10 text-accent relative z-10" />
          </div>
          <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter">System Initialized</h2>
          <p className="text-muted-foreground text-center max-w-sm mb-12 text-lg">
            <span className="text-foreground font-bold">{companyName}</span> is now live with <span className="text-accent font-bold">{branches.length}</span> nodes under intelligence monitoring.
          </p>
          <Button
            className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 py-6 text-lg font-bold shadow-xl"
            onClick={onBack}
          >
            Go to Management Console
          </Button>
        </motion.div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="min-h-screen h-auto items-start bg-background">
      <div className="relative z-10 min-h-screen flex flex-col w-full">
        {/* Glass Header */}
        <header className="border-b border-white/5 bg-background/40 backdrop-blur-xl px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
          <Button variant="ghost" size="icon" onClick={step > 1 ? () => setStep(step - 1) : onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              Enterprise Setup
            </h1>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-accent' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col items-center py-12 px-6">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter">Your Identity</h2>
                    <p className="text-muted-foreground text-lg">Define how your enterprise appears in the network.</p>
                  </div>

                  <div className="glass-panel p-8 rounded-3xl space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="companyName" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Enter the name of your brand..."
                        className="h-14 text-lg bg-white/5 border-white/10 rounded-2xl focus:ring-accent"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This will be the primary identifier for your customers. You can later customize your brand colors and theme.
                      </p>
                    </div>
                  </div>

                  <Button size="lg" className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-lg font-bold" onClick={handleNext}>
                    Continue to Branch Setup
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black tracking-tighter">Network Nodes</h2>
                      <p className="text-muted-foreground">Add your physical locations to the grid.</p>
                    </div>
                    <Button onClick={addBranch} variant="outline" className="rounded-full border-accent/30 text-accent hover:bg-accent/5">
                      <Plus className="w-4 h-4 mr-2" /> Add Branch
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {branches.map((branch, index) => (
                      <motion.div
                        layout
                        key={branch.id}
                        className="glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-black">
                              {index + 1}
                            </div>
                            <Input
                              value={branch.name}
                              onChange={(e) => updateBranch(branch.id, "name", e.target.value)}
                              className="bg-transparent border-none text-xl font-bold focus-visible:ring-0 p-0 h-auto w-auto"
                            />
                          </div>
                          {branches.length > 1 && (
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 rounded-full" onClick={() => removeBranch(branch.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</Label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="Address or coordinates"
                                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                                value={branch.location}
                                onChange={(e) => updateBranch(branch.id, "location", e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max Capacity</Label>
                            <div className="relative">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="number"
                                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                                value={branch.capacity}
                                onChange={(e) => updateBranch(branch.id, "capacity", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Camera Feeds (RTSP)</Label>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-accent font-bold" onClick={() => addRtspLink(branch.id)}>
                              + Add Feed
                            </Button>
                          </div>
                          {branch.rtspLinks.map((link, lIndex) => (
                            <div key={lIndex} className="flex gap-2">
                              <div className="relative flex-1">
                                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  placeholder="rtsp://your-camera-stream"
                                  className="pl-10 bg-white/5 border-white/10 rounded-xl text-xs"
                                  value={link}
                                  onChange={(e) => updateRtspLink(branch.id, lIndex, e.target.value)}
                                />
                              </div>
                              {branch.rtspLinks.length > 1 && (
                                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-muted-foreground hover:text-red-500" onClick={() => removeRtspLink(branch.id, lIndex)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button size="lg" className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-lg font-bold" onClick={handleNext}>
                    Review Network Map
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter">Final Review</h2>
                    <p className="text-muted-foreground">Verify your enterprise deployment configuration.</p>
                  </div>

                  <div className="glass-panel p-8 rounded-3xl space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black">{companyName}</h3>
                        <p className="text-accent font-bold tracking-widest uppercase text-xs">{branches.length} Registered Nodes</p>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 space-y-4">
                      {branches.map(b => (
                        <div key={b.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="font-bold text-sm tracking-tight">{b.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" /> {b.capacity}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Camera className="w-3 h-3" /> {b.rtspLinks.length}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5" onClick={() => setStep(2)}>
                      <ChevronLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                    <Button size="lg" className="flex-[2] h-14 rounded-2xl bg-accent hover:bg-accent/90 text-lg font-bold shadow-xl shadow-accent/20" onClick={handleSubmit}>
                      Confirm & Initialize
                      <Sparkles className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </AuroraBackground>
  );
};

export default EnterpriseRegistration;
