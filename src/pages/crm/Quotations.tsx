import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, IndianRupee, TrendingUp } from "lucide-react";
import { QuotationDialog } from "@/components/dialogs/QuotationDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Quotations = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from("quotations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const columns = [
    { key: "customer", label: "Customer" },
    { 
      key: "amount", 
      label: "Amount",
      render: (value: number) => `₹${value.toLocaleString()}`
    },
    { key: "items", label: "Items" },
    { 
      key: "created_at", 
      label: "Date",
      render: (value: string) => format(new Date(value), "MMM dd, yyyy")
    },
    { 
      key: "valid_until", 
      label: "Valid Until",
      render: (value: string) => format(new Date(value), "MMM dd, yyyy")
    },
    { 
      key: "status", 
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Quotations
          </h1>
          <p className="text-muted-foreground">Manage customer quotations and proposals</p>
        </div>
        <Button className="gap-2" onClick={() => { setSelectedQuotation(null); setDialogOpen(true); }}>
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
            <div className="text-2xl font-bold text-foreground">{quotations.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{quotations.reduce((sum, q) => sum + (q.amount || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All quotations</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {quotations.filter(q => q.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle>Recent Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            title="Recent Quotations" 
            data={quotations} 
            columns={columns}
            actions={(row) => (
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setSelectedQuotation(row); setDialogOpen(true); }}>Edit</Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <QuotationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        quotation={selectedQuotation}
        onSuccess={fetchQuotations}
      />
    </div>
  );
};

export default Quotations;
