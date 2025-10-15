import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const leads = [
  { id: "LEAD-001", company: "Tech Corp", contact: "John Doe", email: "john@techcorp.com", phone: "+1234567890", status: "New", value: "$50,000" },
  { id: "LEAD-002", company: "Global Solutions", contact: "Jane Smith", email: "jane@global.com", phone: "+1234567891", status: "Interested", value: "$75,000" },
  { id: "LEAD-003", company: "Digital Innovations", contact: "Mike Johnson", email: "mike@digital.com", phone: "+1234567892", status: "Quotation", value: "$120,000" },
  { id: "LEAD-004", company: "Smart Systems", contact: "Sarah Wilson", email: "sarah@smart.com", phone: "+1234567893", status: "Converted", value: "$95,000" },
  { id: "LEAD-005", company: "Future Tech", contact: "David Brown", email: "david@future.com", phone: "+1234567894", status: "Lost", value: "$30,000" },
];

const Leads = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Track and manage your sales leads</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <DataTable
        title="All Leads"
        columns={[
          { key: "id", label: "Lead ID" },
          { key: "company", label: "Company" },
          { key: "contact", label: "Contact Person" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
          { key: "value", label: "Potential Value" },
        ]}
        data={leads}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">Follow Up</Button>
            <Button variant="outline" size="sm">Convert</Button>
          </div>
        )}
      />
    </div>
  );
};

export default Leads;
