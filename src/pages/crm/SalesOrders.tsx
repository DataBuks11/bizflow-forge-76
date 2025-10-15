import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, IndianRupee, TrendingUp, Package } from "lucide-react";

const salesOrders = [
  { id: "SO-001", customer: "ABC Corp", quotation: "QUO-002", amount: "₹8,32,000", items: "12", date: "2025-10-14", deliveryDate: "2025-10-21", status: "Processing" },
  { id: "SO-002", customer: "Smart Systems", quotation: "QUO-005", amount: "₹12,45,800", items: "18", date: "2025-10-13", deliveryDate: "2025-10-20", status: "Shipped" },
  { id: "SO-003", customer: "Tech Solutions", quotation: "QUO-001", amount: "₹10,37,500", items: "15", date: "2025-10-12", deliveryDate: "2025-10-19", status: "Delivered" },
  { id: "SO-004", customer: "Global Inc", quotation: "QUO-003", amount: "₹15,78,900", items: "20", date: "2025-10-11", deliveryDate: "2025-10-18", status: "Processing" },
  { id: "SO-005", customer: "Innovation Ltd", quotation: "QUO-004", amount: "₹6,24,500", items: "8", date: "2025-10-10", deliveryDate: "2025-10-17", status: "Pending" },
];

const columns = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "quotation", label: "Quotation Ref" },
  { key: "amount", label: "Amount" },
  { key: "items", label: "Items" },
  { key: "date", label: "Order Date" },
  { key: "deliveryDate", label: "Delivery Date" },
  { 
    key: "status", 
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />
  },
];

const SalesOrders = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Sales Orders
          </h1>
          <p className="text-muted-foreground">Track and manage confirmed sales orders</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹53,18,700</div>
            <p className="text-xs text-success">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-warning">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.2%</div>
            <p className="text-xs text-success">On-time delivery</p>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle>Recent Sales Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable title="Recent Sales Orders" data={salesOrders} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrders;
