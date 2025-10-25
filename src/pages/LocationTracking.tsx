import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { MapPin, Navigation, Locate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Default location: Ujjwal Nagar, Nagpur
const defaultCenter = {
  lat: 21.1458,
  lng: 79.0882,
  name: "Ujjwal Nagar, Nagpur"
};

const LocationTracking = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, name?: string} | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("location_tracking")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    // Get current location or use default
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "Your Current Location"
          };
          setCurrentLocation(newLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default location if geolocation fails
          setCurrentLocation({
            ...defaultCenter,
            name: defaultCenter.name
          });
          toast({ 
            title: "Using Default Location", 
            description: `Using ${defaultCenter.name} as default location`, 
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setCurrentLocation({
        ...defaultCenter,
        name: defaultCenter.name
      });
    }
  }, []);

  const handleGPSCheckIn = async () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation is not supported", variant: "destructive" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { data: employees } = await supabase
            .from("employees")
            .select("*")
            .eq("status", "Active")
            .limit(1);

          if (!employees || employees.length === 0) {
            toast({ title: "Error", description: "No active employee found", variant: "destructive" });
            return;
          }

          const employee = employees[0];
          const currentTime = new Date().toLocaleTimeString();
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          const { error } = await supabase.from("location_tracking").insert([{
            employee_id: employee.id,
            employee_name: employee.name,
            role: employee.role,
            latitude: lat,
            longitude: lng,
            location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            status: "Active",
          }]);

          if (error) throw error;

          setLastCheckIn(currentTime);
          const newLocation = {
            lat: lat,
            lng: lng,
            name: "Your Current Location"
          };
          setCurrentLocation(newLocation);
          
          toast({ 
            title: "Success", 
            description: `GPS Check-In recorded at ${currentTime}` 
          });
          fetchLocations();
        } catch (error: any) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      },
      async (error) => {
        // Use default location if GPS fails
        try {
          const { data: employees } = await supabase
            .from("employees")
            .select("*")
            .eq("status", "Active")
            .limit(1);

          if (!employees || employees.length === 0) {
            toast({ title: "Error", description: "No active employee found", variant: "destructive" });
            return;
          }

          const employee = employees[0];
          const currentTime = new Date().toLocaleTimeString();
          
          const { error: insertError } = await supabase.from("location_tracking").insert([{
            employee_id: employee.id,
            employee_name: employee.name,
            role: employee.role,
            latitude: defaultCenter.lat,
            longitude: defaultCenter.lng,
            location: `${defaultCenter.lat.toFixed(4)}, ${defaultCenter.lng.toFixed(4)} (${defaultCenter.name})`,
            status: "Active",
          }]);

          if (insertError) throw insertError;

          setLastCheckIn(currentTime);
          setCurrentLocation({
            ...defaultCenter,
            name: defaultCenter.name
          });
          
          toast({ 
            title: "Success", 
            description: `GPS Check-In recorded at ${currentTime} using default location` 
          });
          fetchLocations();
        } catch (err: any) {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  const handleGPSCheckOut = async () => {
    try {
      const { data: employees } = await supabase
        .from("employees")
        .select("*")
        .eq("status", "Active")
        .limit(1);

      if (!employees || employees.length === 0) {
        toast({ title: "Error", description: "No active employee found", variant: "destructive" });
        return;
      }

      const employee = employees[0];
      const currentTime = new Date().toLocaleTimeString();
      
      // Update latest location record
      const { data: latestLocation } = await supabase
        .from("location_tracking")
        .select("*")
        .eq("employee_id", employee.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (latestLocation) {
        const { error } = await supabase
          .from("location_tracking")
          .update({ status: "Inactive" })
          .eq("id", latestLocation.id);

        if (error) throw error;
      }

      toast({ 
        title: "Success", 
        description: `GPS Check-Out recorded at ${currentTime}` 
      });
      fetchLocations();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Location Tracking</h1>
          <p className="text-muted-foreground">Real-time employee location monitoring</p>
        </div>
        <Button onClick={fetchLocations}>
          <Navigation className="h-4 w-4 mr-2" />
          Refresh Locations
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Locate className="h-5 w-5" />
            Location Coordinates View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Location Display */}
            {currentLocation && (
              <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{currentLocation.name || "Your Location"}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Latitude:</span>
                        <p className="font-mono font-bold">{currentLocation.lat.toFixed(6)}°</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Longitude:</span>
                        <p className="font-mono font-bold">{currentLocation.lng.toFixed(6)}°</p>
                      </div>
                    </div>
                    <a 
                      href={`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`}
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

            {/* Selected Location Display */}
            {selectedLocation && (
              <div className="p-4 bg-secondary rounded-lg border">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{selectedLocation.name}</h3>
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

            {/* All Employee Locations */}
            {locations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">All Employee Locations</h4>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {locations.map((loc) => (
                    loc.latitude && loc.longitude && (
                      <div 
                        key={loc.id} 
                        className="p-3 bg-card rounded-lg border hover:border-primary cursor-pointer transition-colors"
                        onClick={() => setSelectedLocation({
                          lat: parseFloat(loc.latitude),
                          lng: parseFloat(loc.longitude),
                          name: `${loc.employee_name} - ${loc.role}`
                        })}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${loc.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{loc.employee_name}</span>
                            <span className="text-xs text-muted-foreground">({loc.role})</span>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            {parseFloat(loc.latitude).toFixed(4)}, {parseFloat(loc.longitude).toFixed(4)}
                          </span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>GPS Check-In/Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleGPSCheckIn}>
              <MapPin className="h-4 w-4 mr-2" />
              GPS Check In
            </Button>
            <Button className="w-full" variant="outline" onClick={handleGPSCheckOut}>
              <MapPin className="h-4 w-4 mr-2" />
              GPS Check Out
            </Button>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">
                Last Check-In: {lastCheckIn || "Not checked in"}
              </p>
              {currentLocation && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentLocation.name}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Tracking</span>
                <span className="text-lg font-bold">{locations.filter(l => l.status === "Active").length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Locations</span>
                <span className="text-lg font-bold">{locations.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Updated</span>
                <span className="text-lg font-bold">
                  {locations[0]?.updated_at ? new Date(locations[0].updated_at).toLocaleTimeString() : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Employee Location Status"
        columns={[
          { key: "employee_name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "location", label: "Current Location" },
          { 
            key: "updated_at", 
            label: "Last Update",
            render: (value) => new Date(value).toLocaleString()
          },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={locations}
        actions={(row) => (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (row.latitude && row.longitude) {
                setSelectedLocation({
                  lat: parseFloat(row.latitude),
                  lng: parseFloat(row.longitude),
                  name: `${row.employee_name} - ${row.role}`
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            View Coordinates
          </Button>
        )}
      />
    </div>
  );
};

export default LocationTracking;
