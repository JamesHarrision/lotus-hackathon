import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { apiClient } from "../../lib/axios";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Tag, Percent, Banknote, Text, CheckCircle, XCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface Incentive {
  id: number;
  code: string;
  description: string;
  discountVal: number;
  isPercentage: boolean;
  isActive: boolean;
}

const Incentives = () => {
  const { user } = useAppStore();
  const { toast } = useToast();
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncentive, setEditingIncentive] = useState<Incentive | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountVal: 0,
    isPercentage: true,
    isActive: true
  });

  const fetchIncentives = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/incentives?enterpriseId=${user.id}`);
      setIncentives(data.data || []);
    } catch (error) {
      console.error("Failed to fetch incentives", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncentives();
  }, [user]);

  const handleOpenDialog = (incentive: Incentive | null = null) => {
    if (incentive) {
      setEditingIncentive(incentive);
      setFormData({
        code: incentive.code,
        description: incentive.description || "",
        discountVal: incentive.discountVal,
        isPercentage: incentive.isPercentage,
        isActive: incentive.isActive
      });
    } else {
      setEditingIncentive(null);
      setFormData({
        code: "",
        description: "",
        discountVal: 0,
        isPercentage: true,
        isActive: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIncentive) {
        await apiClient.put(`/incentives/${editingIncentive.id}`, {
          ...formData,
          enterpriseId: user?.id
        });
        toast({ title: "Incentive updated successfully" });
      } else {
        await apiClient.post("/incentives", {
          ...formData,
          enterpriseId: user?.id
        });
        toast({ title: "Incentive created successfully" });
      }
      setIsDialogOpen(false);
      fetchIncentives();
    } catch (error: any) {
      toast({ 
        title: editingIncentive ? "Failed to update incentive" : "Failed to create incentive",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this incentive?")) return;
    try {
      await apiClient.delete(`/incentives/${id}`);
      toast({ title: "Incentive deleted successfully" });
      fetchIncentives();
    } catch (error: any) {
       toast({ 
        title: "Failed to delete incentive",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voucher & Incentives</h1>
          <p className="text-muted-foreground mt-1">Manage rewards for users who balance loads.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Voucher
        </Button>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-900">
                <TableHead className="font-bold">Code</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="font-bold">Value</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell className="text-right flex justify-end gap-2"><div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div></TableCell>
                  </TableRow>
                ))
              ) : incentives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                    No incentives found. Click "Create Voucher" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                incentives.map((inc) => (
                  <TableRow key={inc.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                        {inc.code}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-medium">{inc.description || 'No description'}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                         {inc.isPercentage ? <Percent className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                         {inc.discountVal}{inc.isPercentage ? "%" : " VND"}
                       </div>
                    </TableCell>
                    <TableCell>
                       {inc.isActive ? 
                         <div className="flex items-center gap-1 text-xs font-bold text-emerald-500"><CheckCircle className="w-4 h-4" /> Active</div> :
                         <div className="flex items-center gap-1 text-xs font-bold text-rose-500"><XCircle className="w-4 h-4" /> Inactive</div>
                       }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-indigo-500" onClick={() => handleOpenDialog(inc)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-rose-500" onClick={() => handleDelete(inc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              {editingIncentive ? "Edit Voucher" : "Create New Voucher"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Voucher Code</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input 
                  id="code" 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SUMMER50" 
                  className="pl-9 font-mono uppercase"
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</Label>
              <div className="relative">
                <Text className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Get 50% off when balancing load" 
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountVal" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Discount Value</Label>
                <div className="relative">
                   <Banknote className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                   <Input 
                    id="discountVal" 
                    type="number" 
                    step="0.1"
                    value={formData.discountVal} 
                    onChange={e => setFormData({...formData, discountVal: parseFloat(e.target.value)})}
                    className="pl-9"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-3 pt-1">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-2">Discount Type</Label>
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                   <Label className={`text-xs ${!formData.isPercentage ? 'font-bold text-indigo-500' : 'text-zinc-500'}`}>Fix</Label>
                   <Switch 
                     checked={formData.isPercentage} 
                     onCheckedChange={(val) => setFormData({...formData, isPercentage: val})} 
                   />
                   <Label className={`text-xs ${formData.isPercentage ? 'font-bold text-indigo-500' : 'text-zinc-500'}`}>%</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
               <div className="flex flex-col gap-1">
                 <Label className="text-sm font-bold">Active Status</Label>
                 <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Enable to allow routing AI to use this code</span>
               </div>
               <Switch 
                 checked={formData.isActive} 
                 onCheckedChange={(val) => setFormData({...formData, isActive: val})} 
               />
            </div>

            <DialogFooter className="mt-8 pt-4">
              <Button type="submit" className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20">
                {editingIncentive ? "Save Changes" : "Publish Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Incentives;
