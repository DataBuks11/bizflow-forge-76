import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

const attendanceData = [
  { id: "EMP-001", name: "John Smith", date: "2025-10-15", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present" },
  { id: "EMP-002", name: "Jane Doe", date: "2025-10-15", checkIn: "09:15 AM", checkOut: "06:10 PM", status: "Present" },
  { id: "EMP-003", name: "Mike Johnson", date: "2025-10-15", checkIn: "10:30 AM", checkOut: "06:00 PM", status: "Present" },
  { id: "EMP-004", name: "Sarah Wilson", date: "2025-10-15", checkIn: "-", checkOut: "-", status: "Absent" },
  { id: "EMP-005", name: "David Brown", date: "2025-10-15", checkIn: "09:00 AM", checkOut: "02:00 PM", status: "Present" },
];

const Attendance = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground">Track employee attendance and working hours</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142/156</div>
            <p className="text-xs text-muted-foreground">91% present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">90% punctuality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">10% late today</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button>Check In</Button>
        <Button variant="outline">Check Out</Button>
      </div>

      <DataTable
        title="Today's Attendance"
        columns={[
          { key: "id", label: "Employee ID" },
          { key: "name", label: "Employee Name" },
          { key: "date", label: "Date" },
          { key: "checkIn", label: "Check In" },
          { key: "checkOut", label: "Check Out" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={attendanceData}
      />
    </div>
  );
};

export default Attendance;
