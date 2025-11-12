import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const SuperDistributorStock = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Super Distributor/Stock List</h1>
        <p className="text-muted-foreground mt-2">Manage super distributor stock levels and inventory</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Total Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Super Distributor Stock Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Stock management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperDistributorStock;
