import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Sales Revenue Graph</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Performance Chart</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Inventory Chart</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distributor Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chart Placeholder - Orders Graph</p>
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
