import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Truck, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VehicleDialog } from "@/components/dialogs/VehicleDialog";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const columns = [
    { key: "vehicle_number", label: "Vehicle Number" },
    { key: "vehicle_type", label: "Type" },
    { key: "model", label: "Model" },
    { key: "driver_name", label: "Driver" },
    { key: "driver_phone", label: "Phone" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
          <p className="text-muted-foreground mt-2">Manage fleet and vehicle tracking</p>
        </div>
        <Button onClick={() => { setSelectedVehicle(null); setDialogOpen(true); }}>
          <Truck className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={vehicles}
        loading={loading}
        actions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedVehicle(row); setDialogOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      />

      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={selectedVehicle}
        onSuccess={fetchVehicles}
      />
    </div>
  );
};

export default Vehicle;
