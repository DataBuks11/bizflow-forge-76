import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SalesTargetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target?: any;
  onSuccess: () => void;
}

export function SalesTargetDialog({ open, onOpenChange, target, onSuccess }: SalesTargetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    role: "",
    target: "",
    achieved: "0",
    percentage: 0,
  });

  useEffect(() => {
    if (open) {
      fetchEmployees();
      if (target) {
        setFormData({
          employee_id: target.employee_id || "",
          employee_name: target.employee_name || "",
          role: target.role || "",
          target: target.target || "",
          achieved: target.achieved || "0",
          percentage: target.percentage || 0,
        });
      } else {
        setFormData({
          employee_id: "",
          employee_name: "",
          role: "",
          target: "",
          achieved: "0",
          percentage: 0,
        });
      }
    }
  }, [open, target]);

  const fetchEmployees = async () => {
    const { data } = await supabase.from("employees").select("*").eq("status", "Active");
    setEmployees(data || []);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employee_id: employeeId,
        employee_name: employee.name,
        role: employee.role,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const targetValue = parseFloat(formData.target) || 0;
      const achievedValue = parseFloat(formData.achieved) || 0;
      const percentage = targetValue > 0 ? Math.round((achievedValue / targetValue) * 100) : 0;

      const dataToSubmit = {
        employee_id: formData.employee_id || null,
        employee_name: formData.employee_name,
        role: formData.role,
        target: targetValue,
        achieved: achievedValue,
        percentage,
      };

      if (target) {
        const { error } = await supabase
          .from("sales_targets")
          .update(dataToSubmit)
          .eq("id", target.id);
        if (error) throw error;
        toast({ title: "Success", description: "Sales target updated successfully" });
      } else {
        const { error } = await supabase
          .from("sales_targets")
          .insert([dataToSubmit]);
        if (error) throw error;
        toast({ title: "Success", description: "Sales target created successfully" });
      }
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{target ? "Edit Sales Target" : "Set New Target"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select
              value={formData.employee_id}
              onValueChange={handleEmployeeChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target Amount</Label>
            <Input
              id="target"
              type="number"
              step="0.01"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achieved">Achieved Amount</Label>
            <Input
              id="achieved"
              type="number"
              step="0.01"
              value={formData.achieved}
              onChange={(e) => setFormData({ ...formData, achieved: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : target ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}