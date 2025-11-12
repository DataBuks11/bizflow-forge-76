import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const ReportsScheduler = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports Scheduler</h1>
        <p className="text-muted-foreground mt-2">Schedule and automate report generation</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Scheduling</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Report scheduling features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsScheduler;
