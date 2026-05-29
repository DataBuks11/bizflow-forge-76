import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download } from "lucide-react";

type DataConfig = {
  columns: string[];
  rows: (string | number)[][];
};

const DATA_MAP: Record<string, DataConfig> = {
  "Hierarchy Sort": {
    columns: ["Sort Order", "Level", "Designation", "Reports To", "Region", "Status"],
    rows: [
      [1, "L1", "National Sales Head", "CEO", "PAN India", "Active"],
      [2, "L2", "Regional Manager - North", "National Sales Head", "North", "Active"],
      [3, "L2", "Regional Manager - South", "National Sales Head", "South", "Active"],
      [4, "L3", "Area Sales Manager - Delhi", "RM - North", "Delhi NCR", "Active"],
      [5, "L3", "Area Sales Manager - Mumbai", "RM - West", "Mumbai", "Active"],
      [6, "L4", "Territory Sales Incharge", "ASM Delhi", "South Delhi", "Active"],
      [7, "L5", "Sales Officer", "TSI", "Saket", "Active"],
      [8, "L5", "Sales Officer", "TSI", "Lajpat Nagar", "Active"],
    ],
  },
  "Customer Wise Day Wise PJP": {
    columns: ["Salesman", "Customer", "City", "Visit Day", "Beat", "Frequency", "Last Visit"],
    rows: [
      ["Rahul Sharma", "Sharma General Store", "Delhi", "Monday", "Beat-01", "Weekly", "2025-05-26"],
      ["Rahul Sharma", "Krishna Provisions", "Delhi", "Monday", "Beat-01", "Weekly", "2025-05-26"],
      ["Amit Verma", "Big Bazaar Outlet", "Gurgaon", "Tuesday", "Beat-04", "Bi-Weekly", "2025-05-20"],
      ["Sneha Reddy", "Reliance Fresh", "Hyderabad", "Wednesday", "Beat-07", "Weekly", "2025-05-28"],
      ["Vikram Singh", "More Supermarket", "Jaipur", "Thursday", "Beat-02", "Weekly", "2025-05-22"],
      ["Priya Nair", "Spencer's", "Bangalore", "Friday", "Beat-09", "Weekly", "2025-05-23"],
      ["Karan Mehta", "DMart", "Pune", "Saturday", "Beat-05", "Monthly", "2025-05-10"],
    ],
  },
  "Route List by Market": {
    columns: ["Route Code", "Route Name", "Market", "City", "Outlets", "Salesman", "Status"],
    rows: [
      ["RT-001", "Connaught Place Loop", "Central Delhi", "Delhi", 42, "Rahul Sharma", "Active"],
      ["RT-002", "Andheri West Belt", "Mumbai West", "Mumbai", 38, "Karan Mehta", "Active"],
      ["RT-003", "Banjara Hills Route", "Hyderabad Central", "Hyderabad", 29, "Sneha Reddy", "Active"],
      ["RT-004", "Koramangala Circuit", "Bangalore South", "Bangalore", 51, "Priya Nair", "Active"],
      ["RT-005", "MG Road Stretch", "Pune Central", "Pune", 33, "Karan Mehta", "Active"],
      ["RT-006", "Salt Lake Sector V", "Kolkata East", "Kolkata", 27, "Anjali Das", "Active"],
      ["RT-007", "Anna Nagar Route", "Chennai West", "Chennai", 45, "Suresh Iyer", "Inactive"],
    ],
  },
  "Route Creation": {
    columns: ["Route Code", "Route Name", "Created By", "Created On", "Outlets Mapped", "Distance (KM)", "Status"],
    rows: [
      ["RT-101", "Vasant Kunj New Route", "Admin", "2025-05-20", 24, 12.5, "Active"],
      ["RT-102", "Whitefield Tech Park", "Admin", "2025-05-22", 31, 18.2, "Active"],
      ["RT-103", "Hinjewadi Phase 2", "RM West", "2025-05-25", 19, 9.8, "Pending"],
      ["RT-104", "Gachibowli IT Corridor", "RM South", "2025-05-26", 28, 15.4, "Active"],
      ["RT-105", "Noida Sector 62", "Admin", "2025-05-27", 22, 11.0, "Active"],
      ["RT-106", "Powai Lake Belt", "RM West", "2025-05-28", 17, 7.6, "Draft"],
    ],
  },
  "Route Assignment": {
    columns: ["Route Code", "Route Name", "Salesman", "Assigned Date", "Designation", "Region", "Status"],
    rows: [
      ["RT-001", "Connaught Place Loop", "Rahul Sharma", "2025-01-15", "SO", "North", "Active"],
      ["RT-002", "Andheri West Belt", "Karan Mehta", "2025-01-15", "SO", "West", "Active"],
      ["RT-003", "Banjara Hills Route", "Sneha Reddy", "2025-02-01", "TSI", "South", "Active"],
      ["RT-004", "Koramangala Circuit", "Priya Nair", "2025-02-10", "SO", "South", "Active"],
      ["RT-005", "MG Road Stretch", "Vikram Singh", "2025-03-01", "TSI", "West", "Active"],
      ["RT-006", "Salt Lake Sector V", "Anjali Das", "2025-03-15", "SO", "East", "Active"],
    ],
  },
  "Route Assignment by Month": {
    columns: ["Month", "Route Code", "Salesman", "Total Visits", "Productive Calls", "Achievement %"],
    rows: [
      ["Jan 2025", "RT-001", "Rahul Sharma", 168, 142, 84],
      ["Jan 2025", "RT-002", "Karan Mehta", 152, 128, 84],
      ["Feb 2025", "RT-001", "Rahul Sharma", 160, 145, 91],
      ["Feb 2025", "RT-003", "Sneha Reddy", 144, 121, 84],
      ["Mar 2025", "RT-004", "Priya Nair", 176, 158, 90],
      ["Apr 2025", "RT-005", "Vikram Singh", 168, 139, 83],
      ["May 2025", "RT-006", "Anjali Das", 152, 134, 88],
    ],
  },
  "Monthwise Route Assignment": {
    columns: ["Month", "Total Routes", "Active Routes", "Salesmen Assigned", "Outlets Covered", "Coverage %"],
    rows: [
      ["January 2025", 45, 42, 38, 1820, 92],
      ["February 2025", 47, 44, 40, 1895, 93],
      ["March 2025", 50, 48, 42, 2014, 95],
      ["April 2025", 52, 49, 44, 2102, 94],
      ["May 2025", 55, 52, 46, 2218, 95],
    ],
  },
  "Designation Wise Route Assignment": {
    columns: ["Designation", "Total Salesmen", "Routes Assigned", "Avg Routes/Person", "Active", "Inactive"],
    rows: [
      ["Sales Officer (SO)", 32, 48, 1.5, 30, 2],
      ["Territory Sales Incharge", 18, 36, 2.0, 17, 1],
      ["Area Sales Manager", 8, 24, 3.0, 8, 0],
      ["Regional Manager", 4, 12, 3.0, 4, 0],
      ["Pilot Salesman", 6, 6, 1.0, 5, 1],
    ],
  },
  "Customer Wise Route": {
    columns: ["Customer Code", "Customer Name", "Route", "City", "Type", "Salesman", "Last Order"],
    rows: [
      ["CUST-001", "Sharma General Store", "RT-001", "Delhi", "Retailer", "Rahul Sharma", "2025-05-25"],
      ["CUST-002", "Krishna Provisions", "RT-001", "Delhi", "Retailer", "Rahul Sharma", "2025-05-24"],
      ["CUST-003", "Big Bazaar CP", "RT-001", "Delhi", "Modern Trade", "Rahul Sharma", "2025-05-26"],
      ["CUST-004", "Reliance Smart Andheri", "RT-002", "Mumbai", "Modern Trade", "Karan Mehta", "2025-05-27"],
      ["CUST-005", "More Megastore", "RT-003", "Hyderabad", "Modern Trade", "Sneha Reddy", "2025-05-28"],
      ["CUST-006", "DMart Koramangala", "RT-004", "Bangalore", "Modern Trade", "Priya Nair", "2025-05-26"],
      ["CUST-007", "Spencer's MG Road", "RT-005", "Pune", "Modern Trade", "Vikram Singh", "2025-05-23"],
    ],
  },
  "Salesman & Customer Mapping": {
    columns: ["Salesman", "Employee Code", "Total Customers", "Active", "Region", "Routes", "Target Achv %"],
    rows: [
      ["Rahul Sharma", "EMP-1001", 124, 118, "North", 3, 92],
      ["Karan Mehta", "EMP-1002", 98, 95, "West", 2, 88],
      ["Sneha Reddy", "EMP-1003", 142, 136, "South", 3, 95],
      ["Priya Nair", "EMP-1004", 156, 149, "South", 4, 91],
      ["Vikram Singh", "EMP-1005", 87, 82, "West", 2, 84],
      ["Anjali Das", "EMP-1006", 112, 108, "East", 3, 89],
      ["Suresh Iyer", "EMP-1007", 134, 128, "South", 3, 93],
      ["Amit Verma", "EMP-1008", 76, 71, "North", 2, 81],
    ],
  },
  "City Wise Route": {
    columns: ["City", "State", "Total Routes", "Active Routes", "Outlets", "Salesmen", "Coverage %"],
    rows: [
      ["Delhi", "Delhi NCR", 18, 17, 742, 12, 94],
      ["Mumbai", "Maharashtra", 22, 21, 896, 15, 95],
      ["Bangalore", "Karnataka", 16, 15, 624, 11, 93],
      ["Hyderabad", "Telangana", 12, 12, 482, 8, 96],
      ["Chennai", "Tamil Nadu", 14, 13, 568, 9, 92],
      ["Pune", "Maharashtra", 10, 10, 412, 7, 95],
      ["Kolkata", "West Bengal", 11, 10, 438, 8, 91],
      ["Jaipur", "Rajasthan", 8, 7, 296, 5, 87],
    ],
  },
  "Route Wise Retailer/Distributor": {
    columns: ["Route Code", "Route Name", "Distributor", "Retailers Count", "City", "Total Revenue (₹)"],
    rows: [
      ["RT-001", "Connaught Place Loop", "Delhi Distribution Co.", 42, "Delhi", 1854000],
      ["RT-002", "Andheri West Belt", "Mumbai Mart Pvt Ltd", 38, "Mumbai", 1642000],
      ["RT-003", "Banjara Hills Route", "Hyderabad Traders", 29, "Hyderabad", 1248000],
      ["RT-004", "Koramangala Circuit", "South India Distributors", 51, "Bangalore", 2185000],
      ["RT-005", "MG Road Stretch", "Pune Wholesale Hub", 33, "Pune", 1396000],
      ["RT-006", "Salt Lake Sector V", "East Bengal Trading", 27, "Kolkata", 1102000],
    ],
  },
};

const statusVariant = (val: string): "default" | "secondary" | "destructive" | "outline" => {
  const v = val.toLowerCase();
  if (v === "active") return "default";
  if (v === "inactive" || v === "draft") return "secondary";
  if (v === "pending") return "outline";
  return "outline";
};

export default function PlaceholderPage({ title }: { title: string }) {
  const data = DATA_MAP[title] ?? { columns: ["Item"], rows: [["No data configured"]] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-lg">{title} — {data.rows.length} records</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {data.columns.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => {
                      const colName = data.columns[j]?.toLowerCase() ?? "";
                      if (colName === "status") {
                        return (
                          <TableCell key={j}>
                            <Badge variant={statusVariant(String(cell))}>{cell}</Badge>
                          </TableCell>
                        );
                      }
                      return <TableCell key={j}>{cell}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
