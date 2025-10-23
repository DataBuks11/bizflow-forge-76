import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { MapPin, Navigation } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const LocationTracking = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string>("");

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
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
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
          
          const { error } = await supabase.from("location_tracking").insert([{
            employee_id: employee.id,
            employee_name: employee.name,
            role: employee.role,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            status: "Active",
          }]);

          if (error) throw error;

          setLastCheckIn(currentTime);
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          toast({ 
            title: "Success", 
            description: `GPS Check-In recorded at ${currentTime}` 
          });
          fetchLocations();
        } catch (error: any) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      },
      (error) => {
        toast({ title: "Error", description: "Unable to get your location", variant: "destructive" });
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
          <CardTitle>Live Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentLocation || defaultCenter}
              zoom={12}
            >
              {currentLocation && (
                <Marker 
                  position={currentLocation}
                  label="You"
                />
              )}
              {locations.map((loc) => (
                loc.latitude && loc.longitude && (
                  <Marker
                    key={loc.id}
                    position={{ lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude) }}
                    label={loc.employee_name}
                  />
                )
              ))}
            </GoogleMap>
          </LoadScript>
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
                <p className="text-sm text-muted-foreground">
                  Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </p>
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
                setCurrentLocation({
                  lat: parseFloat(row.latitude),
                  lng: parseFloat(row.longitude),
                });
              }
            }}
          >
            View on Map
          </Button>
        )}
      />
    </div>
  );
};

export default LocationTracking;
