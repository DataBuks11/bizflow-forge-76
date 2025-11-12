import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Distributors from "./pages/Distributors";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import LocationTracking from "./pages/LocationTracking";
import SalesTarget from "./pages/SalesTarget";
import Billing from "./pages/Billing";
import Expenses from "./pages/Expenses";
import Leads from "./pages/crm/Leads";
import Quotations from "./pages/crm/Quotations";
import SalesOrders from "./pages/crm/SalesOrders";
import Attendance from "./pages/hrm/Attendance";
import Leave from "./pages/hrm/Leave";
import Payroll from "./pages/hrm/Payroll";
import Performance from "./pages/hrm/Performance";
import DistributorDashboard from "./pages/distributor/DistributorDashboard";
import DistributorOrders from "./pages/distributor/DistributorOrders";
import CurrencyConverter from "./pages/CurrencyConverter";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DistributorStock from "./pages/DistributorStock";
import GMStatusReport from "./pages/GMStatusReport";
import DistributorGM from "./pages/DistributorGM";
import DistributorFulfillment from "./pages/DistributorFulfillment";
import DMS from "./pages/DMS";
import Message from "./pages/Message";
import Scheme from "./pages/Scheme";
import FileManagement from "./pages/FileManagement";
import StockTransfer from "./pages/StockTransfer";
import SuperDistributorStock from "./pages/SuperDistributorStock";
import Retailers from "./pages/Retailers";
import Audit from "./pages/Audit";
import Vehicle from "./pages/Vehicle";
import NewProjectModule from "./pages/NewProjectModule";
import Project from "./pages/Project";
import ReportsScheduler from "./pages/ReportsScheduler";
import Lead from "./pages/Lead";
import Campaign from "./pages/Campaign";
import SurveyFeedback from "./pages/SurveyFeedback";
import DynamicFilterReport from "./pages/DynamicFilterReport";

const queryClient = new QueryClient();

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          <div className="text-center">Loading...</div>
        </div>
      );
    }
    
    if (!session) {
      return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={session ? <Navigate to="/" replace /> : <Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                    {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header isSidebarOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen(true)} />
                      <main className="flex-1 overflow-y-auto p-6">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/employees" element={<Employees />} />
                          <Route path="/distributors" element={<Distributors />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/location-tracking" element={<LocationTracking />} />
                          <Route path="/sales-target" element={<SalesTarget />} />
                          <Route path="/billing" element={<Billing />} />
                          <Route path="/expenses" element={<Expenses />} />
                          <Route path="/crm/leads" element={<Leads />} />
                          <Route path="/crm/quotations" element={<Quotations />} />
                          <Route path="/crm/orders" element={<SalesOrders />} />
                          <Route path="/hrm/attendance" element={<Attendance />} />
                          <Route path="/hrm/leave" element={<Leave />} />
                          <Route path="/hrm/payroll" element={<Payroll />} />
                          <Route path="/hrm/performance" element={<Performance />} />
                          <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
                          <Route path="/distributor/orders" element={<DistributorOrders />} />
<Route path="/currency-converter" element={<CurrencyConverter />} />
<Route path="/profile" element={<Profile />} />
<Route path="/settings" element={<Settings />} />

{/* Newly added routes */}
<Route path="/distributor-stock" element={<DistributorStock />} />
<Route path="/gm-status-report" element={<GMStatusReport />} />
<Route path="/distributor-gm" element={<DistributorGM />} />
<Route path="/distributor-fulfillment" element={<DistributorFulfillment />} />
<Route path="/dms" element={<DMS />} />
<Route path="/message" element={<Message />} />
<Route path="/scheme" element={<Scheme />} />
<Route path="/file-management" element={<FileManagement />} />
<Route path="/stock-transfer" element={<StockTransfer />} />
<Route path="/super-distributor-stock" element={<SuperDistributorStock />} />
<Route path="/retailers" element={<Retailers />} />
<Route path="/audit" element={<Audit />} />
<Route path="/vehicle" element={<Vehicle />} />
<Route path="/new-project-module" element={<NewProjectModule />} />
<Route path="/project" element={<Project />} />
<Route path="/reports-scheduler" element={<ReportsScheduler />} />
<Route path="/lead" element={<Lead />} />
<Route path="/campaign" element={<Campaign />} />
<Route path="/survey-feedback" element={<SurveyFeedback />} />
<Route path="/dynamic-filter-report" element={<DynamicFilterReport />} />

<Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
