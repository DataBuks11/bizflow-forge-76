import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, IndianRupee, TrendingUp } from "lucide-react";

const quotations = [
  { id: "QUO-001", customer: "ABC Corp", amount: "₹10,37,500", items: "15", date: "2025-10-14", status: "Pending", validUntil: "2025-10-28" },
  { id: "QUO-002", customer: "XYZ Ltd", amount: "₹8,32,000", items: "12", date: "2025-10-13", status: "Accepted", validUntil: "2025-10-27" },
  { id: "QUO-003", customer: "Tech Solutions", amount: "₹15,78,900", items: "20", date: "2025-10-12", status: "Pending", validUntil: "2025-10-26" },
  { id: "QUO-004", customer: "Global Inc", amount: "₹6,24,500", items: "8", date: "2025-10-11", status: "Rejected", validUntil: "2025-10-25" },
  { id: "QUO-005", customer: "Smart Systems", amount: "₹12,45,800", items: "18", date: "2025-10-10", status: "Accepted", validUntil: "2025-10-24" },
];

const columns = [
  { key: "id", label: "Quotation ID" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "items", label: "Items" },
  { key: "date", label: "Date" },
  { key: "validUntil", label: "Valid Until" },
  { 
    key: "status", 
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />
  },
];

const Quotations = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Quotations
          </h1>
          <p className="text-muted-foreground">Manage customer quotations and proposals</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Quotation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹53,18,700</div>
            <p className="text-xs text-muted-foreground">Pending quotations</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <p className="text-xs text-success">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle>Recent Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable title="Recent Quotations" data={quotations} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Quotations;
