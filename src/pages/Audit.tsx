import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { ClipboardCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const Audit = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const columns = [
    { 
      key: "created_at", 
      label: "Date/Time",
      render: (row: any) => format(new Date(row.created_at), "MMM dd, yyyy HH:mm")
    },
    { key: "module", label: "Module" },
    { key: "action", label: "Action" },
    { key: "description", label: "Description" },
    { key: "ip_address", label: "IP Address" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">Track and review system activities</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={auditLogs}
        loading={loading}
      />
    </div>
  );
};

export default Audit;
