import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DistributorDialog } from "@/components/dialogs/DistributorDialog";

const Distributors = () => {
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);

  useEffect(() => {
    fetchDistributors();
  }, []);

  const fetchDistributors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("distributors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setDistributors(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setSelectedDistributor(null);
    setDialogOpen(true);
  };

  const handleEdit = (distributor: any) => {
    setSelectedDistributor(distributor);
    setDialogOpen(true);
  };

  const handleView = (distributor: any) => {
    toast({ 
      title: "Distributor Details", 
      description: `Viewing details for ${distributor.name}` 
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Distributors</h1>
          <p className="text-muted-foreground">Manage your distributor network</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Distributor
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <DataTable
          title="Distributor List"
          columns={[
            { key: "name", label: "Company Name" },
            { key: "contact", label: "Contact Person" },
            { key: "region", label: "Region" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { 
              key: "revenue", 
              label: "Total Revenue",
              render: (value) => `₹${parseFloat(value || 0).toLocaleString('en-IN')}`
            },
            { 
              key: "status", 
              label: "Status",
              render: (value) => <StatusBadge status={value} />
            },
          ]}
          data={distributors}
          actions={(row) => (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => handleView(row)}>View</Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
            </div>
          )}
        />
      )}

      <DistributorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        distributor={selectedDistributor}
        onSuccess={fetchDistributors}
      />
    </div>
  );
};

export default Distributors;
