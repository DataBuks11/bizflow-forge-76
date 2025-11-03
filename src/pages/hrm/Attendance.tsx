import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    const { data } = await supabase.from("attendance").select("*").order("date", { ascending: false });
    if (data) setAttendanceData(data);
    setLoading(false);
  };

  const fetchEmployees = async () => {
    const { data } = await supabase.from("employees").select("*").eq("status", "Active");
    if (data) setEmployees(data);
  };

  const handleCheckIn = async () => {
    try {
      if (employees.length === 0) {
        toast({ title: "Error", description: "No active employees found", variant: "destructive" });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const employee = employees[0];
      
      // Check if already checked in today
      const { data: existingRecord } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employee.id)
        .eq("date", today)
        .single();

      if (existingRecord) {
        toast({ title: "Info", description: "Already checked in today", variant: "destructive" });
        return;
      }

      const currentTime = new Date().toTimeString().split(' ')[0];
      const { error } = await supabase.from("attendance").insert([{
        employee_id: employee.id,
        employee_name: employee.name,
        date: today,
        check_in: currentTime,
        status: "Present",
      }]);

      if (error) throw error;
      
      toast({ 
        title: "Success", 
        description: `Checked in at ${currentTime}` 
      });
      fetchAttendance();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCheckOut = async () => {
    try {
      if (employees.length === 0) {
        toast({ title: "Error", description: "No active employees found", variant: "destructive" });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const employee = employees[0];
      
      const { data: todayRecord } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employee.id)
        .eq("date", today)
        .single();

      if (!todayRecord) {
        toast({ title: "Error", description: "No check-in record found for today", variant: "destructive" });
        return;
      }

      if (todayRecord.check_out) {
        toast({ title: "Info", description: "Already checked out today", variant: "destructive" });
        return;
      }

      const currentTime = new Date().toTimeString().split(' ')[0];
      const { error } = await supabase
        .from("attendance")
        .update({ check_out: currentTime })
        .eq("id", todayRecord.id);

      if (error) throw error;
      
      toast({ 
        title: "Success", 
        description: `Checked out at ${currentTime}` 
      });
      fetchAttendance();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleStatusChange = async (recordId: string, newStatus: string) => {
    await supabase.from("attendance").update({ status: newStatus }).eq("id", recordId);
    fetchAttendance();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track employee attendance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCheckIn}><Clock className="h-4 w-4 mr-2" />Check In</Button>
          <Button variant="outline" onClick={handleCheckOut}><Clock className="h-4 w-4 mr-2" />Check Out</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{attendanceData.length}</div>
          </CardContent>
        </Card>
      </div>

      {!loading && (
        <DataTable
          title="Attendance Records"
          columns={[
            { key: "employee_name", label: "Name" },
            { key: "date", label: "Date" },
            { key: "check_in", label: "Check In" },
            { key: "check_out", label: "Check Out", render: (v) => v || "-" },
            { 
              key: "status", 
              label: "Status",
              render: (value, row) => (
                <Select value={value} onValueChange={(s) => handleStatusChange(row.id, s)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              )
            },
          ]}
          data={attendanceData}
        />
      )}
    </div>
  );
};

export default Attendance;
