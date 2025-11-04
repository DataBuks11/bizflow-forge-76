import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { MapPin, Navigation, Locate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different marker types
const currentLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const activeLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const inactiveLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Default location: Ujjwal Nagar, Nagpur
const defaultCenter: [number, number] = [21.1458, 79.0882];
const defaultCenterName = "Ujjwal Nagar, Nagpur";

const LocationTracking = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{coords: [number, number], name: string} | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<{coords: [number, number], name: string} | null>(null);

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
          setCurrentLocation({
            coords: [position.coords.latitude, position.coords.longitude],
            name: "Your Current Location"
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default location if geolocation fails
          setCurrentLocation({
            coords: defaultCenter,
            name: defaultCenterName
          });
          toast({ 
            title: "Using Default Location", 
            description: `Using ${defaultCenterName} as default location`, 
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
        coords: defaultCenter,
        name: defaultCenterName
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
          setCurrentLocation({
            coords: [lat, lng],
            name: "Your Current Location"
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
            latitude: defaultCenter[0],
            longitude: defaultCenter[1],
            location: `${defaultCenter[0].toFixed(4)}, ${defaultCenter[1].toFixed(4)} (${defaultCenterName})`,
            status: "Active",
          }]);

          if (insertError) throw insertError;

          setLastCheckIn(currentTime);
          setCurrentLocation({
            coords: defaultCenter,
            name: defaultCenterName
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
          <p className="text-muted-foreground">Real-time employee location monitoring - Nagpur Region</p>
        </div>
        <Button onClick={fetchLocations}>
          <Navigation className="h-4 w-4 mr-2" />
          Refresh Locations
        </Button>
      </div>

      <Card id="location-map">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Locate className="h-5 w-5" />
            Live Location Map - Nagpur Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "500px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
            <MapContainer
              center={currentLocation?.coords || defaultCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Current Location Marker */}
              {currentLocation && (
                <Marker position={currentLocation.coords} icon={currentLocationIcon}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm">{currentLocation.name}</h3>
                      <p className="text-xs text-gray-500">
                        {currentLocation.coords[0].toFixed(4)}, {currentLocation.coords[1].toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Employee Location Markers */}
              {locations.map((loc) => {
                if (loc.latitude && loc.longitude) {
                  const position: [number, number] = [parseFloat(loc.latitude), parseFloat(loc.longitude)];
                  return (
                    <Marker
                      key={loc.id}
                      position={position}
                      icon={loc.status === 'Active' ? activeLocationIcon : inactiveLocationIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-sm">{loc.employee_name}</h3>
                          <p className="text-xs text-gray-600">{loc.role}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Status: <span className={loc.status === 'Active' ? 'text-green-600' : 'text-red-600'}>
                              {loc.status}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {position[0].toFixed(4)}, {position[1].toFixed(4)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(loc.updated_at).toLocaleString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
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
                    Location: {currentLocation.coords[0].toFixed(4)}, {currentLocation.coords[1].toFixed(4)}
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
                  coords: [parseFloat(row.latitude), parseFloat(row.longitude)],
                  name: `${row.employee_name} - ${row.role}`
                });
                document.getElementById('location-map')?.scrollIntoView({ behavior: 'smooth' });
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
