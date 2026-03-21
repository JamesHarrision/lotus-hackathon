import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Building2, ScrollText, Users, Home } from "lucide-react";

const SuperAdminLayout = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col hidden md:flex relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-black bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">System Admin</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1 truncate">{user?.name || "Super Admin"}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50" onClick={() => navigate("/superadmin")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Control Center
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium transition-colors" onClick={() => navigate("/superadmin/enterprises")}>
            <Building2 className="mr-2 h-4 w-4" />
            Enterprises
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium transition-colors" onClick={() => navigate("/superadmin/logs")}>
            <ScrollText className="mr-2 h-4 w-4" />
            System Logs
          </Button>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium transition-colors mb-2" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Website
          </Button>
          <Button variant="outline" className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout System
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-4 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
            <div className="flex justify-between items-center mt-1">
              <h2 className="text-lg font-black bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">System Admin</h2>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-rose-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
              <Button variant="outline" size="sm" onClick={() => navigate("/superadmin")} className="whitespace-nowrap rounded-full border-purple-200 text-purple-700">Control Center</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/superadmin/enterprises")} className="whitespace-nowrap rounded-full border-zinc-200">Enterprises</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/superadmin/logs")} className="whitespace-nowrap rounded-full border-zinc-200">System Logs</Button>
            </div>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
