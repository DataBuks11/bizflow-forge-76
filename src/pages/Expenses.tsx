import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, IndianRupee, TrendingUp, AlertCircle } from "lucide-react";
import { ExpenseDialog } from "@/components/dialogs/ExpenseDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Expenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: `Expense ${status.toLowerCase()} successfully` });
      fetchExpenses();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'Pending');
  const approvedExpenses = expenses.filter(exp => exp.status === 'Approved');
  const rejectedExpenses = expenses.filter(exp => exp.status === 'Rejected');

  const pendingTotal = pendingExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const approvedTotal = approvedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const rejectedTotal = rejectedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <p className="text-muted-foreground">Track and approve employee expenses</p>
        </div>
        <Button onClick={() => { setSelectedExpense(null); setDialogOpen(true); }}>
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
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{pendingExpenses.length} requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{approvedTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{approvedExpenses.length} requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{rejectedTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{rejectedExpenses.length} requests</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Expense Requests"
        columns={[
          { key: "employee_name", label: "Employee" },
          { key: "category", label: "Category" },
          { 
            key: "amount", 
            label: "Amount",
            render: (value) => `₹${value.toLocaleString()}`
          },
          { 
            key: "created_at", 
            label: "Date",
            render: (value) => format(new Date(value), "MMM dd, yyyy")
          },
          { 
            key: "status", 
            label: "Status",
            render: (value) => <StatusBadge status={value} />
          },
        ]}
        data={expenses}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => { setSelectedExpense(row); setDialogOpen(true); }}>Edit</Button>
            {row.status === 'Pending' && (
              <>
                <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(row.id, 'Approved')}>Approve</Button>
                <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(row.id, 'Rejected')}>Reject</Button>
              </>
            )}
          </div>
        )}
      />

      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expense={selectedExpense}
        onSuccess={fetchExpenses}
      />
    </div>
  );
};

export default Expenses;
