import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const salesRevenueData = [
  { month: "Jan", revenue: 1820000, profit: 420000 },
  { month: "Feb", revenue: 1950000, profit: 465000 },
  { month: "Mar", revenue: 2240000, profit: 538000 },
  { month: "Apr", revenue: 2080000, profit: 498000 },
  { month: "May", revenue: 2358000, profit: 582000 },
  { month: "Jun", revenue: 2510000, profit: 625000 },
];
const employeePerfData = [
  { name: "Rahul", score: 92 }, { name: "Sneha", score: 95 },
  { name: "Karan", score: 88 }, { name: "Priya", score: 91 },
  { name: "Vikram", score: 84 }, { name: "Anjali", score: 89 },
];
const inventoryData = [
  { category: "Beverages", stock: 4200, min: 1000 },
  { category: "Snacks", stock: 3100, min: 800 },
  { category: "Personal Care", stock: 2400, min: 600 },
  { category: "Household", stock: 1850, min: 500 },
  { category: "Dairy", stock: 980, min: 400 },
];
const orderTrendData = [
  { week: "W1", orders: 128 }, { week: "W2", orders: 142 },
  { week: "W3", orders: 156 }, { week: "W4", orders: 138 },
  { week: "W5", orders: 168 }, { week: "W6", orders: 182 },
];
const expensesData = [
  { name: "Salary", value: 1240000 },
  { name: "Logistics", value: 480000 },
  { name: "Marketing", value: 320000 },
  { name: "Office", value: 180000 },
  { name: "Misc", value: 95000 },
];
const attendanceData = [
  { day: "Mon", present: 142, absent: 14 },
  { day: "Tue", present: 148, absent: 8 },
  { day: "Wed", present: 145, absent: 11 },
  { day: "Thu", present: 150, absent: 6 },
  { day: "Fri", present: 138, absent: 18 },
  { day: "Sat", present: 122, absent: 34 },
];
const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#8b5cf6"];

const Reports = () => {
  const [reportsData, setReportsData] = useState({
    sales: [],
    employees: [],
    inventory: [],
    expenses: [],
    orders: [],
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [sales, employees, inventory, expenses, orders] = await Promise.all([
        supabase.from("sales_targets").select("*"),
        supabase.from("employees").select("*"),
        supabase.from("products").select("*"),
        supabase.from("expenses").select("*"),
        supabase.from("sales_orders").select("*"),
      ]);

      setReportsData({
        sales: sales.data || [],
        employees: employees.data || [],
        inventory: inventory.data || [],
        expenses: expenses.data || [],
        orders: orders.data || [],
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Business Analytics Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Sales Report
    doc.setFontSize(14);
    doc.text("Sales & Revenue", 14, 45);
    autoTable(doc, {
      startY: 50,
      head: [['Employee', 'Target', 'Achieved', 'Percentage']],
      body: reportsData.sales.map((s: any) => [
        s.employee_name,
        `$${s.target}`,
        `$${s.achieved}`,
        `${s.percentage}%`,
      ]),
    });

    // Expenses Report
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Monthly Expenses", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Employee', 'Category', 'Amount', 'Status']],
      body: reportsData.expenses.slice(0, 10).map((e: any) => [
        e.employee_name,
        e.category,
        `$${e.amount}`,
        e.status,
      ]),
    });

    doc.save(`business-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "Success", description: "PDF exported successfully" });
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sales Sheet
    const salesWS = XLSX.utils.json_to_sheet(
      reportsData.sales.map((s: any) => ({
        Employee: s.employee_name,
        Role: s.role,
        Target: s.target,
        Achieved: s.achieved,
        Percentage: s.percentage,
      }))
    );
    XLSX.utils.book_append_sheet(wb, salesWS, "Sales");

    // Inventory Sheet
    const inventoryWS = XLSX.utils.json_to_sheet(
      reportsData.inventory.map((i: any) => ({
        Product: i.name,
        Category: i.category,
        Stock: i.stock,
        MinStock: i.min_stock,
        Location: i.location,
        Status: i.status,
      }))
    );
    XLSX.utils.book_append_sheet(wb, inventoryWS, "Inventory");

    // Expenses Sheet
    const expensesWS = XLSX.utils.json_to_sheet(
      reportsData.expenses.map((e: any) => ({
        Employee: e.employee_name,
        Category: e.category,
        Amount: e.amount,
        Status: e.status,
        Date: e.created_at,
      }))
    );
    XLSX.utils.book_append_sheet(wb, expensesWS, "Expenses");

    XLSX.writeFile(wb, `business-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({ title: "Success", description: "Excel file exported successfully" });
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and data visualization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="profit" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeePerfData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="category" fontSize={12} width={90} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[0,4,4,0]} />
                  <Bar dataKey="min" fill="hsl(var(--accent))" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distributor Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Expenses Summary</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance & Location Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Attendance Chart</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
