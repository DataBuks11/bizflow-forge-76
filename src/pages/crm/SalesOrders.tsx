import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, IndianRupee, TrendingUp, Package } from "lucide-react";
import { SalesOrderDialog } from "@/components/dialogs/SalesOrderDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchSalesOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("sales_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSalesOrders(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "quotation_ref", label: "Quotation Ref" },
    { 
      key: "amount", 
      label: "Amount",
      render: (value: number) => `₹${value.toLocaleString()}`
    },
    { key: "items", label: "Items" },
    { 
      key: "created_at", 
      label: "Order Date",
      render: (value: string) => format(new Date(value), "MMM dd, yyyy")
    },
    { 
      key: "delivery_date", 
      label: "Delivery Date",
      render: (value: string) => format(new Date(value), "MMM dd, yyyy")
    },
    { 
      key: "status", 
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />
    },
  ];

  const totalValue = salesOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const pendingOrders = salesOrders.filter(order => order.status === 'Pending').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Sales Orders
          </h1>
          <p className="text-muted-foreground">Track and manage confirmed sales orders</p>
        </div>
        <Button className="gap-2" onClick={() => { setSelectedOrder(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{salesOrders.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All orders</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingOrders}</div>
            <p className="text-xs text-warning">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {salesOrders.filter(o => o.status === 'Delivered').length}
            </div>
            <p className="text-xs text-success">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle>Recent Sales Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            title="Recent Sales Orders" 
            data={salesOrders} 
            columns={columns}
            actions={(row) => (
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setSelectedOrder(row); setDialogOpen(true); }}>Edit</Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <SalesOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
        onSuccess={fetchSalesOrders}
      />
    </div>
  );
};

export default SalesOrders;
