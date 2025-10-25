import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Locate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CustomerDialog } from "@/components/dialogs/CustomerDialog";

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null);

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

      {/* Customer Locations Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Locate className="h-5 w-5" />
            Customer Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Location Display */}
            {selectedLocation && (
              <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{selectedLocation.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Latitude:</span>
                        <p className="font-mono font-bold">{selectedLocation.lat.toFixed(6)}°</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Longitude:</span>
                        <p className="font-mono font-bold">{selectedLocation.lng.toFixed(6)}°</p>
                      </div>
                    </div>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* All Customer Locations */}
            {customers.filter(c => c.latitude && c.longitude).length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Customer Locations ({customers.filter(c => c.latitude && c.longitude).length})
                </h4>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {customers.filter(c => c.latitude && c.longitude).map((customer) => (
                    <div 
                      key={customer.id} 
                      className="p-3 glass-card rounded-lg hover:border-primary cursor-pointer transition-all retro-hover"
                      onClick={() => setSelectedLocation({
                        lat: parseFloat(customer.latitude),
                        lng: parseFloat(customer.longitude),
                        name: `${customer.name} - ${customer.city || customer.address || 'Customer Location'}`
                      })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${customer.status === 'Active' ? 'bg-success' : 'bg-muted'}`}></div>
                          <span className="font-medium">{customer.name}</span>
                          {customer.city && <span className="text-xs text-muted-foreground">({customer.city})</span>}
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {parseFloat(customer.latitude).toFixed(4)}, {parseFloat(customer.longitude).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No customer locations available</p>
                <p className="text-sm">Add location data to customers to see them on the map</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      ) : (
        <DataTable
          title="Customer List"
          columns={[
            { key: "name", label: "Company Name" },
            { key: "contact", label: "Contact Person" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "city", label: "City" },
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
              {row.latitude && row.longitude && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedLocation({
                      lat: parseFloat(row.latitude),
                      lng: parseFloat(row.longitude),
                      name: `${row.name} - ${row.city || 'Customer Location'}`
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Location
                </Button>
              )}
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
