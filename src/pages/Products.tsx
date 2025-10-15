import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const products = [
  { id: "PRD-001", name: "Product A", category: "Electronics", price: "$299", stock: 150, status: "Active" },
  { id: "PRD-002", name: "Product B", category: "Hardware", price: "$149", stock: 89, status: "Active" },
  { id: "PRD-003", name: "Product C", category: "Software", price: "$499", stock: 200, status: "Active" },
  { id: "PRD-004", name: "Product D", category: "Electronics", price: "$799", stock: 12, status: "Active" },
  { id: "PRD-005", name: "Product E", category: "Accessories", price: "$49", stock: 0, status: "Pending" },
];

const Products = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <DataTable
        title="Product List"
        columns={[
          { key: "id", label: "Product ID" },
          { key: "name", label: "Name" },
          { key: "category", label: "Category" },
          { key: "price", label: "Price" },
          { 
            key: "stock", 
            label: "Stock",
            render: (value) => (
              <span className={value < 20 ? "text-destructive font-medium" : ""}>
                {value}
              </span>
            )
          },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={products}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="outline" size="sm">Delete</Button>
          </div>
        )}
      />
    </div>
  );
};

export default Products;
