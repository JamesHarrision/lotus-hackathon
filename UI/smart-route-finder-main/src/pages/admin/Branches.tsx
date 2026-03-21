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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, MapPin, Camera, Users as UsersIcon, Search, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Branch {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  maxCapacity: number;
  cameraUrl?: string;
  currentLoad: number;
}

const Branches = () => {
  const { user } = useAppStore();
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lat: 0,
    lng: 0,
    maxCapacity: 50,
    cameraUrl: ""
  });

  const fetchBranches = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/branches?enterpriseId=${user.id}`);
      setBranches(data.data || []);
    } catch (error) {
      console.error("Failed to fetch branches", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [user]);

  const handleOpenDialog = (branch: Branch | null = null) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address,
        lat: branch.lat,
        lng: branch.lng,
        maxCapacity: branch.maxCapacity,
        cameraUrl: branch.cameraUrl || ""
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: "",
        address: "",
        lat: 21.0285,
        lng: 105.8542,
        maxCapacity: 100,
        cameraUrl: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleGeocode = async () => {
    if (!formData.address) {
      toast({ title: "Please enter an address first", variant: "destructive" });
      return;
    }

    try {
      setIsGeocoding(true);
      const { data } = await apiClient.get(`/branches/geocode/search?address=${encodeURIComponent(formData.address)}`);
      
      if (data.success && data.data) {
        const { lat, lng, formattedAddress } = data.data;
        setFormData({
          ...formData,
          lat,
          lng,
          address: formattedAddress || formData.address
        });
        toast({ 
          title: "Address Geocoded!", 
          description: `Located at ${lat.toFixed(4)}, ${lng.toFixed(4)}` 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Geocoding failed", 
        description: error.response?.data?.message || "Could not find coordinates for this address.",
        variant: "destructive"
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await apiClient.put(`/branches/${editingBranch.id}`, {
          ...formData,
          enterpriseId: user?.id
        });
        toast({ title: "Branch updated successfully" });
      } else {
        await apiClient.post("/branches", {
          ...formData,
          enterpriseId: user?.id
        });
        toast({ title: "Branch created successfully" });
      }
      setIsDialogOpen(false);
      fetchBranches();
    } catch (error: any) {
      toast({ 
        title: editingBranch ? "Failed to update branch" : "Failed to create branch",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    try {
      // Assuming a DELETE endpoint exists or using general update with a 'deleted' flag if relevant
      // For now, call placeholders or notify UI
      toast({ title: "Delete functionality pending backend support" });
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground mt-1">Configure your branch locations and capacities.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> Add New Branch
        </Button>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-900">
                <TableHead className="font-bold">Branch Name</TableHead>
                <TableHead className="font-bold">Address</TableHead>
                <TableHead className="font-bold">Coordinates</TableHead>
                <TableHead className="font-bold">Max Capacity</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell><div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div></TableCell>
                    <TableCell className="text-right flex justify-end gap-2"><div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div></TableCell>
                  </TableRow>
                ))
              ) : branches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                    No branches found. Click "Add New Branch" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                branches.map((branch) => (
                  <TableRow key={branch.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{branch.address}</TableCell>
                    <TableCell className="text-xs font-mono">
                      {branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5">
                         <UsersIcon className="w-3.5 h-3.5 text-zinc-400" />
                         <span className="font-bold">{branch.maxCapacity}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-primary" onClick={() => handleOpenDialog(branch)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-rose-500" onClick={() => handleDelete(branch.id)}>
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
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingBranch ? "Edit Branch" : "Register New Branch"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Central Plaza Branch" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <div className="flex gap-2">
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Street, District 1, Hanoi" 
                  required 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleGeocode}
                  disabled={isGeocoding || !formData.address}
                  className="shrink-0"
                  title="Geocode Address"
                >
                  {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Click the search icon to auto-fill coordinates from address.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                   <Input 
                    id="lat" 
                    type="number" 
                    step="0.000001"
                    value={formData.lat} 
                    onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                    className="pl-9"
                    placeholder="21.0285" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                   <Input 
                    id="lng" 
                    type="number" 
                    step="0.000001"
                    value={formData.lng} 
                    onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                    className="pl-9"
                    placeholder="105.8542" 
                    required 
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Maximum Capacity</Label>
              <div className="relative">
                 <UsersIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                 <Input 
                  id="capacity" 
                  type="number" 
                  value={formData.maxCapacity} 
                  onChange={e => setFormData({...formData, maxCapacity: parseInt(e.target.value)})}
                  className="pl-9"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="camera">Camera Stream URL (Optional)</Label>
              <div className="relative">
                 <Camera className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                 <Input 
                  id="camera" 
                  value={formData.cameraUrl} 
                  onChange={e => setFormData({...formData, cameraUrl: e.target.value})}
                  className="pl-9"
                  placeholder="rtsp://camera1.example.com/live"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20">
                {editingBranch ? "Save Changes" : "Create Branch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;
