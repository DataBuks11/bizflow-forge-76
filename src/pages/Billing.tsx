import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { InvoiceDialog } from "@/components/dialogs/InvoiceDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Billing = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending');
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoice & Billing</h1>
          <p className="text-muted-foreground">Manage invoices and track payments</p>
        </div>
        <Button onClick={() => { setSelectedInvoice(null); setDialogOpen(true); }}>
          <FileText className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Payment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold">₹{totalInvoiced.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/30 dark:border-gray-700/30">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Invoice List"
        columns={[
          { key: "customer", label: "Customer" },
          { key: "order_id", label: "Order ID" },
          { 
            key: "amount", 
            label: "Amount",
            render: (value) => `₹${value.toLocaleString()}`
          },
          { 
            key: "tax", 
            label: "Tax",
            render: (value) => `₹${value.toLocaleString()}`
          },
          { 
            key: "total", 
            label: "Total",
            render: (value) => `₹${value.toLocaleString()}`
          },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
          { 
            key: "created_at", 
            label: "Date",
            render: (value) => format(new Date(value), "MMM dd, yyyy")
          },
        ]}
        data={invoices}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setSelectedInvoice(row); setDialogOpen(true); }}>
              View
            </Button>
          </div>
        )}
      />

      <InvoiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        invoice={selectedInvoice}
        onSuccess={fetchInvoices}
      />
    </div>
  );
};

export default Billing;
