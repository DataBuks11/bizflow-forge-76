import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LeaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const LeaveRequestDialog = ({ open, onOpenChange, onSuccess }: LeaveRequestDialogProps) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    leave_type: "Sick Leave",
    start_date: "",
    end_date: "",
    reason: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEmployees();
      setFormData({
        employee_id: "",
        employee_name: "",
        leave_type: "Sick Leave",
        start_date: "",
        end_date: "",
        reason: "",
        status: "Pending",
      });
    }
  }, [open]);

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
      const { error } = await supabase.from("leave_requests").insert([formData]);

      if (error) throw error;
      toast({ title: "Success", description: "Leave request submitted successfully" });
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
          <DialogTitle>Apply Leave</DialogTitle>
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
              <Label htmlFor="leave_type">Leave Type</Label>
              <Select value={formData.leave_type} onValueChange={(value) => setFormData({ ...formData, leave_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
