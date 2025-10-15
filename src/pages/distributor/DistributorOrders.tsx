import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const orders = [
  { id: "ORD-101", product: "Product A", quantity: 50, amount: "$14,950", status: "Pending", date: "2025-10-14" },
  { id: "ORD-102", product: "Product B", quantity: 30, amount: "$4,470", status: "Approved", date: "2025-10-13" },
  { id: "ORD-103", product: "Product C", quantity: 100, amount: "$49,900", status: "Delivered", date: "2025-10-10" },
  { id: "ORD-104", product: "Product D", quantity: 25, amount: "$19,975", status: "Pending", date: "2025-10-09" },
  { id: "ORD-105", product: "Product E", quantity: 60, amount: "$2,940", status: "Approved", date: "2025-10-08" },
];

const DistributorOrders = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Place New Order
        </Button>
      </div>

      <DataTable
        title="Order History"
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
          { key: "date", label: "Order Date" },
        ]}
        data={orders}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">Track</Button>
            <Button variant="outline" size="sm">View</Button>
          </div>
        )}
      />
    </div>
  );
};

export default DistributorOrders;
