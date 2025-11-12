import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Store, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RetailerDialog } from "@/components/dialogs/RetailerDialog";

const Retailers = () => {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  const fetchRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRetailers(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  const columns = [
    { key: "name", label: "Retailer Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Retailers</h1>
          <p className="text-muted-foreground mt-2">Manage your retailer network</p>
        </div>
        <Button onClick={() => { setSelectedRetailer(null); setDialogOpen(true); }}>
          <Store className="h-4 w-4 mr-2" />
          Add Retailer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={retailers}
        loading={loading}
        actions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedRetailer(row); setDialogOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      />

      <RetailerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        retailer={selectedRetailer}
        onSuccess={fetchRetailers}
      />
    </div>
  );
};

export default Retailers;
