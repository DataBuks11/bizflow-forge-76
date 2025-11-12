import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, ArrowRight, MapPin, Calendar } from "lucide-react";
import { StockTransferDialog } from "@/components/dialogs/StockTransferDialog";

const StockTransfer = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transfers] = useState([
    {
      id: 1,
      product: "Premium Widget A",
      from: "Main Warehouse",
      to: "Distribution Center East",
      quantity: 500,
      status: "Completed",
      date: "2025-01-15",
    },
    {
      id: 2,
      product: "Electronic Component B",
      from: "Distribution Center West",
      to: "Regional Hub North",
      quantity: 250,
      status: "In Transit",
      date: "2025-01-16",
    },
    {
      id: 3,
      product: "Industrial Tool C",
      from: "Main Warehouse",
      to: "Distribution Center South",
      quantity: 150,
      status: "Pending",
      date: "2025-01-17",
    },
    {
      id: 4,
      product: "Consumer Product D",
      from: "Regional Hub North",
      to: "Distribution Center East",
      quantity: 800,
      status: "Completed",
      date: "2025-01-14",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Transit":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Transfer</h1>
          <p className="text-muted-foreground">Transfer inventory between locations</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <PackageOpen className="h-4 w-4 mr-2" />
          New Transfer
        </Button>
      </div>

      <div className="grid gap-4">
        {transfers.map((transfer) => (
          <Card key={transfer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <PackageOpen className="h-5 w-5 text-primary" />
                    {transfer.product}
                  </CardTitle>
                  <CardDescription>Quantity: {transfer.quantity} units</CardDescription>
                </div>
                <Badge variant={getStatusColor(transfer.status)}>{transfer.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{transfer.from}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{transfer.to}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{transfer.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <StockTransferDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default StockTransfer;
