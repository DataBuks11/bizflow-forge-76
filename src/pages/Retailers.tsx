import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

const Retailers = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Retailers</h1>
        <p className="text-muted-foreground mt-2">Manage your retailer network and relationships</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Total Retailers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active retailers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retailer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Retailer management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Retailers;
