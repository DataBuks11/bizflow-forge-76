import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, IndianRupee, TrendingUp, AlertCircle } from "lucide-react";

const expenses = [
  { id: "EXP-001", employee: "John Smith", category: "Fuel", amount: "$250", date: "2025-10-14", status: "Approved" },
  { id: "EXP-002", employee: "Jane Doe", category: "Logistics", amount: "$1,200", date: "2025-10-13", status: "Pending" },
  { id: "EXP-003", employee: "Mike Johnson", category: "Marketing", amount: "$850", date: "2025-10-12", status: "Approved" },
  { id: "EXP-004", employee: "Sarah Wilson", category: "Fuel", amount: "$180", date: "2025-10-11", status: "Rejected" },
  { id: "EXP-005", employee: "David Brown", category: "Client Meeting", amount: "$450", date: "2025-10-10", status: "Pending" },
];

const Expenses = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <p className="text-muted-foreground">Track and approve employee expenses</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Submit Expense
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹40,56,120</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">15 requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$34,200</div>
            <p className="text-xs text-muted-foreground">45 requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,270</div>
            <p className="text-xs text-muted-foreground">8 requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Fuel</span>
                <span className="font-semibold">$12,400</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Logistics</span>
                <span className="font-semibold">$18,900</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Marketing</span>
                <span className="font-semibold">$9,850</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Client Meetings</span>
                <span className="font-semibold">$7,770</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department-wise Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Sales</span>
                <span className="font-semibold">$22,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Operations</span>
                <span className="font-semibold">$14,300</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Marketing</span>
                <span className="font-semibold">$9,850</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Logistics</span>
                <span className="font-semibold">$2,270</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Expense Requests"
        columns={[
          { key: "id", label: "Expense ID" },
          { key: "employee", label: "Employee" },
          { key: "category", label: "Category" },
          { key: "amount", label: "Amount" },
          { key: "date", label: "Date" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={expenses}
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

export default Expenses;
