import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { ShoppingCart, Package, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentOrders = [
  { id: "ORD-101", product: "Product A", quantity: 50, amount: "$14,950", status: "Pending", date: "2025-10-14" },
  { id: "ORD-102", product: "Product B", quantity: 30, amount: "$4,470", status: "Approved", date: "2025-10-13" },
  { id: "ORD-103", product: "Product C", quantity: 100, amount: "$49,900", status: "Delivered", date: "2025-10-10" },
];

const DistributorDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Distributor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Manage your orders and inventory.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value="87"
          icon={ShoppingCart}
          trend={{ value: "8 this week", positive: true }}
        />
        <StatCard
          title="Products Available"
          value="156"
          icon={Package}
        />
        <StatCard
          title="Active Employees"
          value="12"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value="$184,500"
          icon={DollarSign}
          trend={{ value: "15.3%", positive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold">10% Off on Electronics</h3>
                <p className="text-sm text-muted-foreground">Valid until Oct 31, 2025</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold">Buy 100+ Get Free Shipping</h3>
                <p className="text-sm text-muted-foreground">Limited time offer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">Place New Order</Button>
            <Button className="w-full" variant="outline">Check Inventory</Button>
            <Button className="w-full" variant="outline">View Reports</Button>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Recent Orders"
        columns={[
          { key: "id", label: "Order ID" },
          { key: "product", label: "Product" },
          { key: "quantity", label: "Quantity" },
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

export default DistributorDashboard;
