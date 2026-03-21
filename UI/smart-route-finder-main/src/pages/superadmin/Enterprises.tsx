import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Plus, Edit2, Trash2, Search, Loader2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { TableRowSkeleton } from "@/components/SkeletonLoader";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Enterprise {
  id: number;
  name: string;
  userId: number;
  user?: User;
  createdAt: string;
}

const SuperAdminEnterprises = () => {
  const { toast } = useToast();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null);
  const [formData, setFormData] = useState({ name: "", userId: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [entRes, usersRes] = await Promise.all([
        apiClient.get("/enterprises"),
        apiClient.get("/users")
      ]);
      setEnterprises(entRes.data.data || []);
      // Filter only users who are potential owners or already ENTERPRISE role
      setUsers(usersRes.data.data.filter((u: User) => u.role === "USER" || u.role === "ENTERPRISE") || []);
    } catch (error) {
      console.error("Failed to fetch superadmin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (ent: Enterprise | null = null) => {
    if (ent) {
      setEditingEnterprise(ent);
      setFormData({ name: ent.name, userId: ent.userId.toString() });
    } else {
      setEditingEnterprise(null);
      setFormData({ name: "", userId: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEnterprise) {
        await apiClient.put(`/enterprises/${editingEnterprise.id}`, { name: formData.name });
        toast({ title: "Enterprise updated" });
      } else {
        await apiClient.post("/enterprises", { 
            name: formData.name, 
            userId: parseInt(formData.userId) 
        });
        toast({ title: "Enterprise onboarded successfully" });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ 
        title: "Operation failed", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete enterprise and all its branches?")) return;
    try {
      await apiClient.delete(`/enterprises/${id}`);
      toast({ title: "Enterprise deleted" });
      fetchData();
    } catch (error) {
      toast({ title: "Failed to delete enterprise", variant: "destructive" });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Enterprise Hub
          </h1>
          <p className="text-zinc-500 font-medium mt-1">Manage and monitor your global business partners.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 px-6 py-6 h-auto font-bold transition-all hover:scale-105 active:scale-95">
          <Plus className="mr-2 h-5 w-5" /> Onboard Partner
        </Button>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[2rem]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-100/50 dark:bg-zinc-800/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-6 px-8 font-black text-zinc-400 uppercase tracking-widest text-[10px]">Enterprise Entity</TableHead>
                <TableHead className="py-6 font-black text-zinc-400 uppercase tracking-widest text-[10px]">Administrative Owner</TableHead>
                <TableHead className="py-6 font-black text-zinc-400 uppercase tracking-widest text-[10px]">Partnership Date</TableHead>
                <TableHead className="py-6 px-8 text-right font-black text-zinc-400 uppercase tracking-widest text-[10px]">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))
              ) : enterprises.map((ent, idx) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={ent.id} 
                  className="group border-zinc-100 dark:border-zinc-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all"
                >
                  <TableCell className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                        {ent.name.charAt(0)}
                      </div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">{ent.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">{ent.user?.name || "System Master"}</span>
                      <span className="text-xs text-zinc-400 font-medium">{ent.user?.email || "internal@system.io"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-500 font-medium">
                       <Clock className="w-4 h-4 opacity-50" />
                       {new Date(ent.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="outline" size="icon" onClick={() => handleOpenDialog(ent)} className="rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:text-indigo-600 transition-all">
                          <Edit2 className="h-4 w-4" />
                       </Button>
                       <Button variant="outline" size="icon" onClick={() => handleDelete(ent.id)} className="rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all hover:border-rose-200">
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
              {editingEnterprise ? "Refine Portfolio" : "Strategic Onboarding"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
             <div className="space-y-3">
               <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Enterprise Identity</Label>
               <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Highlands Coffee Global"
                className="h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg"
                required
               />
             </div>
             {!editingEnterprise && (
               <div className="space-y-3">
                 <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Assign Executive Account</Label>
                 <select 
                   className="w-full h-14 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                   value={formData.userId}
                   onChange={e => setFormData({...formData, userId: e.target.value})}
                   required
                 >
                   <option value="">Choose owner...</option>
                   {users.map(u => (
                     <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                   ))}
                 </select>
                 <p className="text-[10px] text-zinc-400 font-medium italic ml-1">Only verified Standard or Enterprise accounts qualify.</p>
               </div>
             )}
             <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg transition-all shadow-xl shadow-indigo-500/25 active:scale-95">
                  {editingEnterprise ? "Commit Changes" : "Initiate Partnership"}
                </Button>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SuperAdminEnterprises;
