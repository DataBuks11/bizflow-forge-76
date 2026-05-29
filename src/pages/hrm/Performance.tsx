import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/DataTable";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const performanceData = [
  { id: "EMP-001", name: "John Smith", role: "Sales Manager", target: 100, achieved: 95, rating: 4.5 },
  { id: "EMP-002", name: "Jane Doe", role: "Sales Rep", target: 80, achieved: 88, rating: 4.8 },
  { id: "EMP-003", name: "Mike Johnson", role: "Sales Rep", target: 80, achieved: 72, rating: 3.9 },
  { id: "EMP-004", name: "Sarah Wilson", role: "Customer Service", target: 100, achieved: 98, rating: 4.7 },
  { id: "EMP-005", name: "David Brown", role: "Operations", target: 90, achieved: 85, rating: 4.2 },
];

const Performance = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Reports</h1>
        <p className="text-muted-foreground">Track employee performance and achievements</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Target vs Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="target" fill="hsl(var(--accent))" radius={[4,4,0,0]} />
                  <Bar dataKey="achieved" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Sales</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Operations</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <Progress value={87} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Customer Service</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <Progress value={95} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Logistics</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Employee Performance"
        columns={[
          { key: "id", label: "Employee ID" },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { 
            key: "target", 
            label: "Target",
            render: (value) => `${value}%`
          },
          { 
            key: "achieved", 
            label: "Achieved",
            render: (value, row) => (
              <span className={value >= row.target ? "text-success font-medium" : "text-warning font-medium"}>
                {value}%
              </span>
            )
          },
          { 
            key: "rating", 
            label: "Rating",
            render: (value) => (
              <div className="flex items-center gap-1">
                <span className="font-semibold">{value}</span>
                <span className="text-warning">★</span>
              </div>
            )
          },
        ]}
        data={performanceData}
      />
    </div>
  );
};

export default Performance;
