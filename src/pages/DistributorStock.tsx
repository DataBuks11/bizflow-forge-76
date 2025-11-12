import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function DistributorStock() {
  const [stock, setStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("distributor_stock" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStock(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch distributor stock");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: "distributor_name", label: "Name" },
    { key: "distributor_code", label: "Code" },
    { key: "case_size", label: "Size" },
    { key: "quantity_cases", label: "Cases" },
    { key: "stock_value", label: "Value" },
    { key: "created_at", label: "Date" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Distributor Stock</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <DataTable
          title="Stock Entries"
          data={stock}
          columns={columns}
        />
      )}
    </div>
  );
}
