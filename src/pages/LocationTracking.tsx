import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { MapPin, Navigation, AlertCircle } from "lucide-react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629, // Center of India
};

const LocationTracking = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string>("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

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
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setMapCenter(newLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({ 
            title: "Location Access Denied", 
            description: "Please enable location access to use GPS features", 
            variant: "destructive" 
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
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
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setMapCenter(newLocation);
          
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

  if (loadError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading Google Maps. Please check your API key configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

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

      {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Live Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={currentLocation ? 14 : 5}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {currentLocation && (
              <Marker 
                position={currentLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
                title="Your Location"
              />
            )}
            {locations.map((loc) => (
              loc.latitude && loc.longitude && (
                <Marker
                  key={loc.id}
                  position={{ lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude) }}
                  icon={{
                    url: loc.status === "Active" 
                      ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                  title={`${loc.employee_name} - ${loc.role}`}
                />
              )
            ))}
          </GoogleMap>
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
                const location = {
                  lat: parseFloat(row.latitude),
                  lng: parseFloat(row.longitude),
                };
                setMapCenter(location);
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
