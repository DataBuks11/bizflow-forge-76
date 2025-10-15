import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";

const inventory = [
  { id: "PRD-001", name: "Product A", category: "Electronics", stock: 150, minStock: 50, location: "Warehouse A", status: "Active" },
  { id: "PRD-002", name: "Product B", category: "Hardware", stock: 89, minStock: 100, location: "Warehouse A", status: "Active" },
  { id: "PRD-003", name: "Product C", category: "Software", stock: 200, minStock: 50, location: "Warehouse B", status: "Active" },
  { id: "PRD-004", name: "Product D", category: "Electronics", stock: 12, minStock: 50, location: "Warehouse C", status: "Active" },
  { id: "PRD-005", name: "Product E", category: "Accessories", stock: 0, minStock: 20, location: "Warehouse A", status: "Pending" },
];

const Inventory = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your product inventory</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value="156"
          icon={Package}
        />
        <StatCard
          title="Low Stock Items"
          value="12"
          icon={AlertTriangle}
        />
        <StatCard
          title="Out of Stock"
          value="3"
          icon={TrendingDown}
        />
        <StatCard
          title="In Stock"
          value="141"
          icon={CheckCircle}
        />
      </div>

      <div className="flex gap-4">
        <Button>Stock Transfer</Button>
        <Button variant="outline">Generate Report</Button>
      </div>

      <DataTable
        title="Product Stock Summary"
        columns={[
          { key: "id", label: "Product ID" },
          { key: "name", label: "Product Name" },
          { key: "category", label: "Category" },
          { 
            key: "stock", 
            label: "Current Stock",
            render: (value, row) => (
              <span className={value < row.minStock ? "text-destructive font-medium" : value === 0 ? "text-destructive font-bold" : ""}>
                {value}
              </span>
            )
          },
          { key: "minStock", label: "Min Stock" },
          { key: "location", label: "Location" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={inventory}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">Update Stock</Button>
            <Button variant="outline" size="sm">Transfer</Button>
          </div>
        )}
      />
    </div>
  );
};

export default Inventory;
