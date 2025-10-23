import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SalesTargetDialog } from "@/components/dialogs/SalesTargetDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SalesTarget = () => {
  const [targets, setTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);

  const fetchTargets = async () => {
    try {
      const { data, error } = await supabase
        .from("sales_targets")
        .select("*")
        .order("percentage", { ascending: false });

      if (error) throw error;
      
      // Calculate ranks
      const rankedData = (data || []).map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
      
      setTargets(rankedData);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const totalTarget = targets.reduce((sum, t) => sum + (parseFloat(t.target) || 0), 0);
  const totalAchieved = targets.reduce((sum, t) => sum + (parseFloat(t.achieved) || 0), 0);
  const teamPercentage = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;
  const topPerformer = targets[0];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Target & Achievement</h1>
          <p className="text-muted-foreground">Track sales performance against targets</p>
        </div>
        <Button onClick={() => { setSelectedTarget(null); setDialogOpen(true); }}>
          <Target className="h-4 w-4 mr-2" />
          Set New Target
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTarget.toLocaleString()}</div>
            <Progress value={teamPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{teamPercentage}% achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achieved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAchieved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">{teamPercentage}% of target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformer?.employee_name || "N/A"}</div>
            <p className="text-xs text-muted-foreground mt-2">{topPerformer?.percentage || 0}% target achieved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {targets.slice(0, 3).map((employee) => (
              <div key={employee.id} className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  employee.rank === 1 ? 'bg-warning text-warning-foreground' :
                  employee.rank === 2 ? 'bg-muted text-foreground' :
                  'bg-accent text-accent-foreground'
                }`}>
                  #{employee.rank}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{employee.employee_name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{employee.percentage}%</p>
                  <p className="text-sm text-muted-foreground">${employee.achieved.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="Sales Target vs Achievement"
        columns={[
          { key: "employee_name", label: "Name" },
          { key: "role", label: "Role" },
          { 
            key: "target", 
            label: "Target",
            render: (value) => `$${parseFloat(value).toLocaleString()}`
          },
          { 
            key: "achieved", 
            label: "Achieved",
            render: (value) => `$${parseFloat(value).toLocaleString()}`
          },
          { 
            key: "percentage", 
            label: "Achievement %",
            render: (value) => (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Progress value={value} className="flex-1" />
                  <span className="text-sm font-medium">{value}%</span>
                </div>
              </div>
            )
          },
          { key: "rank", label: "Rank" },
        ]}
        data={targets}
        actions={(row) => (
          <Button variant="outline" size="sm" onClick={() => { setSelectedTarget(row); setDialogOpen(true); }}>
            Edit
          </Button>
        )}
      />

      <SalesTargetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        target={selectedTarget}
        onSuccess={fetchTargets}
      />
    </div>
  );
};

export default SalesTarget;
