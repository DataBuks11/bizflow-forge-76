import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PayrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const PayrollDialog = ({ open, onOpenChange, onSuccess }: PayrollDialogProps) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    basic_salary: 0,
    allowances: 0,
    deductions: 0,
    net_salary: 0,
    month: "",
    year: new Date().getFullYear(),
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEmployees();
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      setFormData({
        employee_id: "",
        employee_name: "",
        basic_salary: 0,
        allowances: 0,
        deductions: 0,
        net_salary: 0,
        month: currentMonth,
        year: new Date().getFullYear(),
        status: "Pending",
      });
    }
  }, [open]);

  useEffect(() => {
    const netSalary = formData.basic_salary + formData.allowances - formData.deductions;
    setFormData((prev) => ({ ...prev, net_salary: netSalary }));
  }, [formData.basic_salary, formData.allowances, formData.deductions]);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("status", "Active");

    if (!error && data) {
      setEmployees(data);
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      setFormData({
        ...formData,
        employee_id: employeeId,
        employee_name: employee.name,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("payroll").insert([formData]);

      if (error) throw error;
      toast({ title: "Success", description: "Payroll processed successfully" });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Payroll</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={formData.employee_id} onValueChange={handleEmployeeChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basic_salary">Basic Salary</Label>
              <Input
                id="basic_salary"
                type="number"
                value={formData.basic_salary}
                onChange={(e) => setFormData({ ...formData, basic_salary: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowances">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="net_salary">Net Salary</Label>
              <Input
                id="net_salary"
                type="number"
                value={formData.net_salary}
                disabled
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Process"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
