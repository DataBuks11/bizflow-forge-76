import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { MapPin, Navigation, Locate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Default location: Ujjwal Nagar, Nagpur
const defaultCenter = {
  lat: 21.1458,
  lng: 79.0882,
  name: "Ujjwal Nagar, Nagpur"
};

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const LocationTracking = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, name?: string} | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [mapApiKey, setMapApiKey] = useState<string>('');
  const isPlaceholderKey = (k?: string) => !k || k === 'YOUR_GOOGLE_MAPS_API_KEY';
  useEffect(() => {
    const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();
    const stored = localStorage.getItem('gmaps_key') || '';
    const initial = !isPlaceholderKey(envKey) ? (envKey as string) : stored;
    setMapApiKey(initial);
  }, []);

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
            Live Location Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPlaceholderKey(mapApiKey) ? (
            <div className="space-y-4 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                Enter a Google Maps Browser API key to load the live map. Restrict it to this domain in Google Cloud for safety.
              </p>
              <div className="flex gap-2 max-w-xl">
                <Input
                  placeholder="Paste Google Maps API key"
                  value={mapApiKey}
                  onChange={(e) => setMapApiKey(e.target.value.trim())}
                />
                <Button
                  onClick={() => {
                    if (isPlaceholderKey(mapApiKey)) {
                      toast({ title: "Invalid API key", description: "Please paste a valid Google Maps API key.", variant: "destructive" });
                      return;
                    }
                    localStorage.setItem('gmaps_key', mapApiKey);
                    toast({ title: "Saved", description: "Map key saved for this browser." });
                  }}
                >
                  Load Map
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: You can also set VITE_GOOGLE_MAPS_API_KEY in your environment later; we’ll auto-use it when available.
              </p>
            </div>
          ) : (
            <LoadScript 
              googleMapsApiKey={mapApiKey}
              onError={() => toast({ title: "Maps failed to load", description: "Check your API key restrictions.", variant: "destructive" })}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={currentLocation || defaultCenter}
                zoom={13}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                {/* Current Location Marker */}
                {currentLocation && (
                  <Marker
                    position={currentLocation}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                    onClick={() => setSelectedMarker('current')}
                  />
                )}

                {/* Employee Location Markers */}
                {locations.map((loc) => {
                  if (loc.latitude && loc.longitude) {
                    const position = {
                      lat: parseFloat(loc.latitude),
                      lng: parseFloat(loc.longitude)
                    };
                    return (
                      <Marker
                        key={loc.id}
                        position={position}
                        icon={{
                          url: loc.status === 'Active' 
                            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        }}
                        onClick={() => setSelectedMarker(loc.id)}
                      >
                        {selectedMarker === loc.id && (
                          <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                            <div className="p-2">
                              <h3 className="font-semibold text-sm">{loc.employee_name}</h3>
                              <p className="text-xs text-gray-600">{loc.role}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Status: <span className={loc.status === 'Active' ? 'text-green-600' : 'text-red-600'}>
                                  {loc.status}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">
                                {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                              </p>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    );
                  }
                  return null;
                })}

                {/* Current Location Info Window */}
                {selectedMarker === 'current' && currentLocation && (
                  <InfoWindow
                    position={currentLocation}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold text-sm">{currentLocation.name || "Your Location"}</h3>
                      <p className="text-xs text-gray-500">
                        {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          )}
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
