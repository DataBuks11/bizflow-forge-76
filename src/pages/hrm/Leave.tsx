import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LeaveRequestDialog } from "@/components/dialogs/LeaveRequestDialog";

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    const { data } = await supabase.from("leave_requests").select("*").order("created_at", { ascending: false });
    if (data) setLeaveRequests(data);
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    await supabase.from("leave_requests").update({ status: newStatus }).eq("id", requestId);
    toast({ title: "Status updated" });
    fetchLeaveRequests();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Apply Leave</Button>
      </div>

      <DataTable
        title="Leave Requests"
        columns={[
          { key: "employee_name", label: "Employee" },
          { key: "leave_type", label: "Type" },
          { key: "start_date", label: "From" },
          { key: "end_date", label: "To" },
          { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
        ]}
        data={leaveRequests}
        actions={(row) => (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleStatusChange(row.id, "Pending")}>Pending</Button>
            <Button size="sm" onClick={() => handleStatusChange(row.id, "Approved")}>Approved</Button>
            <Button size="sm" onClick={() => handleStatusChange(row.id, "Rejected")}>Rejected</Button>
          </div>
        )}
      />

      <LeaveRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchLeaveRequests} />
    </div>
  );
};

export default Leave;
