import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CustomerDialog } from "@/components/dialogs/CustomerDialog";

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleView = (customer: any) => {
    toast({ 
      title: "Customer Details", 
      description: `Viewing details for ${customer.name}` 
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <DataTable
          title="Customer List"
          columns={[
            { key: "name", label: "Company Name" },
            { key: "contact", label: "Contact Person" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "type", label: "Type" },
            { 
              key: "status", 
              label: "Status",
              render: (value) => <StatusBadge status={value} />
            },
          ]}
          data={customers}
          actions={(row) => (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => handleView(row)}>View</Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
            </div>
          )}
        />
      )}

      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={selectedCustomer}
        onSuccess={fetchCustomers}
      />
    </div>
  );
};

export default Customers;
