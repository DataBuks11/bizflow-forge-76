import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { MapPin, Navigation } from "lucide-react";

const locationData = [
  { id: "EMP-001", name: "John Smith", role: "Sales Rep", location: "New York, NY", lastUpdate: "10:30 AM", status: "Active" },
  { id: "EMP-002", name: "Jane Doe", role: "Delivery Staff", location: "Los Angeles, CA", lastUpdate: "10:28 AM", status: "Active" },
  { id: "EMP-003", name: "Mike Johnson", role: "Sales Rep", location: "Chicago, IL", lastUpdate: "10:25 AM", status: "Active" },
  { id: "EMP-004", name: "Sarah Wilson", role: "Field Manager", location: "Houston, TX", lastUpdate: "09:45 AM", status: "Active" },
];

const LocationTracking = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Location Tracking</h1>
          <p className="text-muted-foreground">Real-time employee location monitoring</p>
        </div>
        <Button>
          <Navigation className="h-4 w-4 mr-2" />
          Refresh Locations
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg bg-secondary">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Map Placeholder - Google Maps/Mapbox Integration</p>
              <p className="text-sm text-muted-foreground">Employee pins will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>GPS Check-In/Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Check In</Button>
            <Button className="w-full" variant="outline">Check Out</Button>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Last Check-In: Today at 09:00 AM</p>
              <p className="text-sm text-muted-foreground">Location: Office - Main Building</p>
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
                <span className="text-sm">Active Field Staff</span>
                <span className="text-lg font-bold">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">In Office</span>
                <span className="text-lg font-bold">98</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">On Leave</span>
                <span className="text-lg font-bold">16</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Employee Location Status"
        columns={[
          { key: "id", label: "Employee ID" },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "location", label: "Current Location" },
          { key: "lastUpdate", label: "Last Update" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={locationData}
        actions={(row) => (
          <Button variant="outline" size="sm">Track</Button>
        )}
      />
    </div>
  );
};

export default LocationTracking;
