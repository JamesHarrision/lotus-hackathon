import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ThemeToggle from "./components/ThemeToggle";
import { ContactBox } from "./components/ContactBox";

const queryClient = new QueryClient();

import { useSocketIntegration } from "./hooks/useSocketIntegration";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EnterpriseDetails from "./pages/EnterpriseDetails";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Branches from "./pages/admin/Branches";
import Incentives from "./pages/admin/Incentives";
import Analytics from "./pages/admin/Analytics";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import SuperAdminEnterprises from "./pages/superadmin/Enterprises";
import SuperAdminLogs from "./pages/superadmin/Logs";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const AppContent = () => {
  const location = useLocation();
  useSocketIntegration();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Landing />
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Register />
          </motion.div>
        } />
        
        {/* Protected Standard User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full">
              <Home />
            </motion.div>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/enterprise/:id" element={<EnterpriseDetails />} />
        </Route>
        
        {/* Protected Enterprise Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="ENTERPRISE" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="branches" element={<Branches />} />
            <Route path="incentives" element={<Incentives />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Protected Super Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="SUPERADMIN" />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="enterprises" element={<SuperAdminEnterprises />} />
            <Route path="logs" element={<SuperAdminLogs />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="fixed top-4 right-4 z-[100] bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
            <ThemeToggle />
          </div>
          <ContactBox onOpenAIChat={() => console.log("Open AI Chat")} />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
