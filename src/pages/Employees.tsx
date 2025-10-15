import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const employees = [
  { id: "EMP-001", name: "John Smith", role: "Sales Manager", department: "Sales", email: "john@company.com", phone: "+1234567890", status: "Active" },
  { id: "EMP-002", name: "Jane Doe", role: "HR Manager", department: "Human Resources", email: "jane@company.com", phone: "+1234567891", status: "Active" },
  { id: "EMP-003", name: "Mike Johnson", role: "Sales Rep", department: "Sales", email: "mike@company.com", phone: "+1234567892", status: "Active" },
  { id: "EMP-004", name: "Sarah Wilson", role: "Accountant", department: "Finance", email: "sarah@company.com", phone: "+1234567893", status: "Active" },
  { id: "EMP-005", name: "David Brown", role: "Warehouse Manager", department: "Logistics", email: "david@company.com", phone: "+1234567894", status: "Active" },
];

const Employees = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <DataTable
        title="Employee List"
        columns={[
          { key: "id", label: "Employee ID" },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "department", label: "Department" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={employees}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">View</Button>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        )}
      />
    </div>
  );
};

export default Employees;
