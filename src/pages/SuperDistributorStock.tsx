import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Package, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SuperDistributorStockDialog } from "@/components/dialogs/SuperDistributorStockDialog";

const SuperDistributorStock = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchStock = async () => {
    try {
      const { data, error } = await supabase
        .from("super_distributor_stock")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStock(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const columns = [
    { key: "super_distributor_name", label: "Super Distributor" },
    { key: "item_name", label: "Item Name" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
    { key: "quantity_cases", label: "Cases" },
    { key: "quantity_pcs", label: "Pcs" },
    { key: "stock_value", label: "Value", render: (row: any) => `₹${row.stock_value}` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Super Distributor Stock</h1>
          <p className="text-muted-foreground mt-2">Manage super distributor stock levels</p>
        </div>
        <Button onClick={() => { setSelectedStock(null); setDialogOpen(true); }}>
          <Package className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={stock}
        loading={loading}
        actions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedStock(row); setDialogOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      />

      <SuperDistributorStockDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        stock={selectedStock}
        onSuccess={fetchStock}
      />
    </div>
  );
};

export default SuperDistributorStock;
