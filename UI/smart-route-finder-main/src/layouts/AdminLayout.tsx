import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Settings, MapPin } from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-primary">Enterprise Panel</h2>
          <p className="text-sm text-zinc-500 mt-1 truncate">{user?.name || "Admin"}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start font-medium bg-zinc-100 dark:bg-zinc-800" onClick={() => navigate("/admin")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50" onClick={() => navigate("/admin/branches")}>
            <MapPin className="mr-2 h-4 w-4" />
            Branches
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50" onClick={() => navigate("/admin/analytics")}>
            <Settings className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary">Enterprise Panel</h2>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="whitespace-nowrap rounded-full">Dashboard</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/branches")} className="whitespace-nowrap rounded-full">Branches</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/analytics")} className="whitespace-nowrap rounded-full">Analytics</Button>
            </div>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
