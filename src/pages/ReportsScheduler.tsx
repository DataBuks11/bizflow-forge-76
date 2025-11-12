import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Calendar, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReportScheduleDialog } from "@/components/dialogs/ReportScheduleDialog";
import { format } from "date-fns";

const ReportsScheduler = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("report_schedules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const columns = [
    { key: "report_name", label: "Report Name" },
    { key: "report_type", label: "Type" },
    { key: "frequency", label: "Frequency" },
    { 
      key: "next_run_date", 
      label: "Next Run",
      render: (row: any) => row.next_run_date ? format(new Date(row.next_run_date), "MMM dd, yyyy HH:mm") : "Not scheduled"
    },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Report Scheduler</h1>
          <p className="text-muted-foreground mt-2">Schedule and automate report generation</p>
        </div>
        <Button onClick={() => { setSelectedSchedule(null); setDialogOpen(true); }}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Report
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={schedules}
        loading={loading}
        actions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedSchedule(row); setDialogOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      />

      <ReportScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schedule={selectedSchedule}
        onSuccess={fetchSchedules}
      />
    </div>
  );
};

export default ReportsScheduler;
