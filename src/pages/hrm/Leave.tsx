import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar } from "lucide-react";

const leaveRequests = [
  { id: "LEAVE-001", employee: "John Smith", type: "Vacation", from: "2025-10-20", to: "2025-10-25", days: 5, reason: "Family trip", status: "Pending" },
  { id: "LEAVE-002", employee: "Jane Doe", type: "Sick Leave", from: "2025-10-16", to: "2025-10-17", days: 2, reason: "Medical", status: "Approved" },
  { id: "LEAVE-003", employee: "Mike Johnson", type: "Personal", from: "2025-10-22", to: "2025-10-24", days: 3, reason: "Personal work", status: "Pending" },
  { id: "LEAVE-004", employee: "Sarah Wilson", type: "Vacation", from: "2025-11-01", to: "2025-11-10", days: 10, reason: "Annual vacation", status: "Approved" },
  { id: "LEAVE-005", employee: "David Brown", type: "Sick Leave", from: "2025-10-18", to: "2025-10-18", days: 1, reason: "Fever", status: "Rejected" },
];

const Leave = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Apply Leave
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Calendar className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Leave Requests"
        columns={[
          { key: "id", label: "Request ID" },
          { key: "employee", label: "Employee" },
          { key: "type", label: "Leave Type" },
          { key: "from", label: "From Date" },
          { key: "to", label: "To Date" },
          { key: "days", label: "Days" },
          { key: "reason", label: "Reason" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={leaveRequests}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">Approve</Button>
            <Button variant="outline" size="sm">Reject</Button>
          </div>
        )}
      />
    </div>
  );
};

export default Leave;
