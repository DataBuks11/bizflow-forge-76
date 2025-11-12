import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DataTable } from "@/components/dashboard/DataTable";

const DistributorStock = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Distributor Stock | App";
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("distributor_stock")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Distributor Stock</h1>
        <p className="text-muted-foreground">Live snapshot of distributor inventory</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading distributor stock…</div>
      ) : (
        <DataTable
          title="Stock Entries"
          columns={[
            { key: "item_name", label: "Name" },
            { key: "item_code", label: "Code" },
            { key: "case_size", label: "Size" },
            { key: "quantity_cases", label: "Cases" },
            { key: "stock_value", label: "Value", render: (v) => `₹${Number(v).toLocaleString()}` },
            { key: "created_at", label: "Date", render: (v) => new Date(v).toLocaleDateString() },
          ]}
          data={rows}
        />
      )}
    </div>
  );
};

export default DistributorStock;
