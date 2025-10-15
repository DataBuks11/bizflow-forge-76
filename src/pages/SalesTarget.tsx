import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const targetData = [
  { id: "EMP-001", name: "John Smith", role: "Sales Rep", target: "$50,000", achieved: "$42,500", percentage: 85, rank: 2 },
  { id: "EMP-002", name: "Jane Doe", role: "Sales Manager", target: "$100,000", achieved: "$95,000", percentage: 95, rank: 1 },
  { id: "EMP-003", name: "Mike Johnson", role: "Sales Rep", target: "$50,000", achieved: "$38,000", percentage: 76, rank: 3 },
  { id: "EMP-004", name: "Sarah Wilson", role: "Sales Rep", target: "$50,000", achieved: "$35,500", percentage: 71, rank: 4 },
  { id: "EMP-005", name: "David Brown", role: "Sales Rep", target: "$50,000", achieved: "$28,900", percentage: 58, rank: 5 },
];

const SalesTarget = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Target & Achievement</h1>
          <p className="text-muted-foreground">Track sales performance against targets</p>
        </div>
        <Button>
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
            <div className="text-2xl font-bold">$300,000</div>
            <Progress value={78} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">78% achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achieved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$239,900</div>
            <p className="text-xs text-success mt-2">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jane Doe</div>
            <p className="text-xs text-muted-foreground mt-2">95% target achieved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {targetData.slice(0, 3).map((employee) => (
              <div key={employee.id} className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  employee.rank === 1 ? 'bg-warning text-warning-foreground' :
                  employee.rank === 2 ? 'bg-muted text-foreground' :
                  'bg-accent text-accent-foreground'
                }`}>
                  #{employee.rank}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{employee.percentage}%</p>
                  <p className="text-sm text-muted-foreground">{employee.achieved}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="Sales Target vs Achievement"
        columns={[
          { key: "id", label: "Employee ID" },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "target", label: "Target" },
          { key: "achieved", label: "Achieved" },
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
        data={targetData}
      />
    </div>
  );
};

export default SalesTarget;
