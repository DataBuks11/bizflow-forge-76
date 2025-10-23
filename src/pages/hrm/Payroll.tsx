import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PayrollDialog } from "@/components/dialogs/PayrollDialog";

const Payroll = () => {
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    const { data } = await supabase.from("payroll").select("*").order("created_at", { ascending: false });
    if (data) setPayrollData(data);
  };

  const handleStatusChange = async (payrollId: string, newStatus: string) => {
    await supabase.from("payroll").update({ status: newStatus }).eq("id", payrollId);
    toast({ title: "Status updated" });
    fetchPayroll();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Process employee salaries</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Process Payroll</Button>
      </div>

      <DataTable
        title="Employee Payroll"
        columns={[
          { key: "employee_name", label: "Name" },
          { key: "basic_salary", label: "Salary", render: (v) => `₹${parseFloat(v || 0).toLocaleString('en-IN')}` },
          { key: "net_salary", label: "Net", render: (v) => `₹${parseFloat(v || 0).toLocaleString('en-IN')}` },
          { 
            key: "status", 
            label: "Status",
            render: (value, row) => (
              <Select value={value} onValueChange={(s) => handleStatusChange(row.id, s)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processed">Processed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            )
          },
        ]}
        data={payrollData}
      />

      <PayrollDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchPayroll} />
    </div>
  );
};

export default Payroll;
