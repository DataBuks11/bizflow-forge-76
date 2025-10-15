import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

const invoices = [
  { id: "INV-001", customer: "ABC Corp", orderId: "ORD-001", amount: "₹10,37,500", tax: "₹1,03,750", total: "₹11,41,250", status: "Paid", date: "2025-10-14" },
  { id: "INV-002", customer: "XYZ Ltd", orderId: "ORD-002", amount: "₹7,39,000", tax: "₹73,900", total: "₹8,12,900", status: "Pending", date: "2025-10-13" },
  { id: "INV-003", customer: "Tech Solutions", orderId: "ORD-003", amount: "₹12,61,600", tax: "₹1,26,160", total: "₹13,87,760", status: "Paid", date: "2025-10-12" },
  { id: "INV-004", customer: "Global Traders", orderId: "ORD-004", amount: "₹5,60,250", tax: "₹56,025", total: "₹6,16,275", status: "Pending", date: "2025-10-11" },
];

const Billing = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoice & Billing</h1>
          <p className="text-muted-foreground">Manage invoices and track payments</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/20 dark:border-gray-700/20">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold">₹10,37,500.00</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20 dark:border-gray-700/20">
              <span className="text-sm text-muted-foreground">Tax (10%)</span>
              <span className="font-semibold">₹1,03,750.00</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/20 dark:border-gray-700/20">
              <span className="text-sm text-muted-foreground">Discount</span>
              <span className="font-semibold text-success">-₹20,750.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">₹11,20,500.00</span>
            </div>
            <Button className="w-full">Process Payment</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold">₹2,36,16,500</p>
              </div>
              <div className="text-center p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-success">₹2,04,01,400</p>
              </div>
              <div className="text-center p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">₹32,15,100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Invoice List"
        columns={[
          { key: "id", label: "Invoice ID" },
          { key: "customer", label: "Customer" },
          { key: "orderId", label: "Order ID" },
          { key: "amount", label: "Amount" },
          { key: "tax", label: "Tax" },
          { key: "total", label: "Total" },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
          { key: "date", label: "Date" },
        ]}
        data={invoices}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">View</Button>
          </div>
        )}
      />
    </div>
  );
};

export default Billing;
