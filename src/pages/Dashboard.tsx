import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { IndianRupee, Users, Building2, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentOrders = [
  { id: "ORD-001", customer: "ABC Corp", amount: "₹10,37,500", status: "Pending", date: "2025-10-14" },
  { id: "ORD-002", customer: "XYZ Ltd", amount: "₹7,39,000", status: "Approved", date: "2025-10-13" },
  { id: "ORD-003", customer: "Tech Solutions", amount: "₹12,61,600", status: "Completed", date: "2025-10-12" },
  { id: "ORD-004", customer: "Global Traders", amount: "₹5,60,250", status: "Pending", date: "2025-10-11" },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value="₹2,35,84,500"
          icon={IndianRupee}
          trend={{ value: "12.5%", positive: true }}
        />
        <StatCard
          title="Total Distributors"
          value="48"
          icon={Building2}
          trend={{ value: "3 new", positive: true }}
        />
        <StatCard
          title="Active Employees"
          value="156"
          icon={Users}
        />
        <StatCard
          title="Pending Orders"
          value="23"
          icon={ShoppingCart}
          trend={{ value: "5 urgent", positive: false }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Sales Graph</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Performance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Recent Orders"
        columns={[
          { key: "id", label: "Order ID" },
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
          { key: "date", label: "Date" },
        ]}
        data={recentOrders}
      />
    </div>
  );
};

export default Dashboard;
