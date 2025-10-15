import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const distributors = [
  { id: "DIST-001", name: "Metro Distributors", contact: "Robert Johnson", region: "North", email: "robert@metro.com", phone: "+1234567890", revenue: "$245,000", status: "Active" },
  { id: "DIST-002", name: "City Traders", contact: "Linda Martinez", region: "South", email: "linda@city.com", phone: "+1234567891", revenue: "$189,500", status: "Active" },
  { id: "DIST-003", name: "Express Distribution", contact: "James Wilson", region: "East", email: "james@express.com", phone: "+1234567892", revenue: "$312,000", status: "Active" },
  { id: "DIST-004", name: "Prime Logistics", contact: "Patricia Davis", region: "West", email: "patricia@prime.com", phone: "+1234567893", revenue: "$156,800", status: "Active" },
  { id: "DIST-005", name: "Swift Supply Co", contact: "Michael Brown", region: "Central", email: "michael@swift.com", phone: "+1234567894", revenue: "$98,200", status: "Pending" },
];

const Distributors = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Distributors</h1>
          <p className="text-muted-foreground">Manage your distributor network</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Distributor
        </Button>
      </div>

      <DataTable
        title="Distributor List"
        columns={[
          { key: "id", label: "Distributor ID" },
          { key: "name", label: "Company Name" },
          { key: "contact", label: "Contact Person" },
          { key: "region", label: "Region" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "revenue", label: "Total Revenue" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={distributors}
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

export default Distributors;
