import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

const payrollData = [
  { id: "EMP-001", name: "John Smith", baseSalary: "$5,000", incentive: "$500", deduction: "$150", netSalary: "$5,350", status: "Processed" },
  { id: "EMP-002", name: "Jane Doe", baseSalary: "$6,500", incentive: "$800", deduction: "$200", netSalary: "$7,100", status: "Processed" },
  { id: "EMP-003", name: "Mike Johnson", baseSalary: "$4,500", incentive: "$350", deduction: "$100", netSalary: "$4,750", status: "Pending" },
  { id: "EMP-004", name: "Sarah Wilson", baseSalary: "$5,500", incentive: "$600", deduction: "$180", netSalary: "$5,920", status: "Processed" },
  { id: "EMP-005", name: "David Brown", baseSalary: "$4,800", incentive: "$400", deduction: "$120", netSalary: "$5,080", status: "Pending" },
];

const Payroll = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Process employee salaries and incentives</p>
        </div>
        <Button>Process Payroll</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$842,500</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incentives</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48,200</div>
            <p className="text-xs text-muted-foreground">Performance bonuses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees Paid</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142/156</div>
            <p className="text-xs text-muted-foreground">14 pending</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Employee Payroll"
        columns={[
          { key: "id", label: "Employee ID" },
          { key: "name", label: "Name" },
          { key: "baseSalary", label: "Base Salary" },
          { key: "incentive", label: "Incentive" },
          { key: "deduction", label: "Deduction" },
          { 
            key: "netSalary", 
            label: "Net Salary",
            render: (value) => <span className="font-semibold">{value}</span>
          },
          { key: "status", label: "Status" },
        ]}
        data={payrollData}
        actions={(row) => (
          <Button variant="outline" size="sm">View Details</Button>
        )}
      />
    </div>
  );
};

export default Payroll;
