import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

import { useSocketIntegration } from "./hooks/useSocketIntegration";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import EnterpriseDetails from "./pages/EnterpriseDetails";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Branches from "./pages/admin/Branches";
import Analytics from "./pages/admin/Analytics";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  useSocketIntegration();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Standard User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/enterprise/:id" element={<EnterpriseDetails />} />
              </Route>
              
              {/* Protected Enterprise Admin Routes */}
              <Route element={<ProtectedRoute requiredRole="ENTERPRISE" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="branches" element={<Branches />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Route>

              {/* Protected Super Admin Routes */}
              <Route element={<ProtectedRoute requiredRole="SUPERADMIN" />}>
                <Route path="/superadmin" element={<SuperAdminLayout />}>
                  <Route index element={<SuperAdminDashboard />} />
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
