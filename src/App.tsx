import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
            {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
