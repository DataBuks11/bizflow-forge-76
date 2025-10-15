import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const customers = [
  { id: "CUST-001", name: "ABC Corporation", contact: "John Smith", email: "john@abc.com", phone: "+1234567890", type: "Enterprise", status: "Active" },
  { id: "CUST-002", name: "XYZ Limited", contact: "Jane Doe", email: "jane@xyz.com", phone: "+1234567891", type: "Corporate", status: "Active" },
  { id: "CUST-003", name: "Tech Solutions Inc", contact: "Mike Johnson", email: "mike@tech.com", phone: "+1234567892", type: "SME", status: "Active" },
  { id: "CUST-004", name: "Global Traders", contact: "Sarah Wilson", email: "sarah@global.com", phone: "+1234567893", type: "Enterprise", status: "Active" },
  { id: "CUST-005", name: "Digital Innovations", contact: "David Brown", email: "david@digital.com", phone: "+1234567894", type: "SME", status: "Pending" },
];

const Customers = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <DataTable
        title="Customer List"
        columns={[
          { key: "id", label: "Customer ID" },
          { key: "name", label: "Company Name" },
          { key: "contact", label: "Contact Person" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "type", label: "Type" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={customers}
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

export default Customers;
