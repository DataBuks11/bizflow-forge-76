import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { StockTransferDialog } from "@/components/dialogs/StockTransferDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Inventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const totalProducts = inventory.length;
  const lowStock = inventory.filter(item => item.stock < item.min_stock && item.stock > 0).length;
  const outOfStock = inventory.filter(item => item.stock === 0).length;
  const inStock = inventory.filter(item => item.stock >= item.min_stock).length;

  const generateReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Inventory Report", 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    doc.text(`Total Products: ${totalProducts}`, 14, 40);
    doc.text(`In Stock: ${inStock}`, 14, 47);
    doc.text(`Low Stock: ${lowStock}`, 14, 54);
    doc.text(`Out of Stock: ${outOfStock}`, 14, 61);
    
    autoTable(doc, {
      startY: 70,
      head: [['Product Name', 'Category', 'Stock', 'Min Stock', 'Location', 'Status']],
      body: inventory.map(item => [
        item.name,
        item.category,
        item.stock.toString(),
        item.min_stock.toString(),
        item.location || 'N/A',
        item.status,
      ]),
    });
    
    doc.save(`inventory-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "Success", description: "Report generated successfully" });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your product inventory</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={Package}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStock.toString()}
          icon={AlertTriangle}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock.toString()}
          icon={TrendingDown}
        />
        <StatCard
          title="In Stock"
          value={inStock.toString()}
          icon={CheckCircle}
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={() => setTransferDialogOpen(true)}>Stock Transfer</Button>
        <Button variant="outline" onClick={generateReport}>Generate Report</Button>
      </div>

      <DataTable
        title="Product Stock Summary"
        columns={[
          { key: "name", label: "Product Name" },
          { key: "category", label: "Category" },
          { 
            key: "stock", 
            label: "Current Stock",
            render: (value, row) => (
              <span className={value < row.min_stock ? "text-destructive font-medium" : value === 0 ? "text-destructive font-bold" : ""}>
                {value}
              </span>
            )
          },
          { key: "min_stock", label: "Min Stock" },
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
            <Button variant="outline" size="sm" onClick={() => { setSelectedProduct(row); setDialogOpen(true); }}>Update Stock</Button>
            <Button variant="outline" size="sm">Transfer</Button>
          </div>
        )}
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSuccess={fetchInventory}
      />

      <StockTransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        onSuccess={fetchInventory}
      />
    </div>
  );
};

export default Inventory;
