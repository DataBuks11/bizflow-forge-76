import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, TrendingUp, Gift } from "lucide-react";

const Scheme = () => {
  const schemes = [
    {
      id: 1,
      name: "Q1 Sales Boost",
      type: "Discount",
      discount: "15%",
      validUntil: "2025-03-31",
      status: "Active",
      description: "15% discount on all electronics for bulk orders above 50 units",
    },
    {
      id: 2,
      name: "New Distributor Bonus",
      type: "Cashback",
      discount: "10%",
      validUntil: "2025-04-30",
      status: "Active",
      description: "10% cashback for new distributor registrations",
    },
    {
      id: 3,
      name: "Festival Special",
      type: "Bundle Offer",
      discount: "20%",
      validUntil: "2025-02-28",
      status: "Upcoming",
      description: "Bundle offer with 20% off on selected product combinations",
    },
    {
      id: 4,
      name: "Loyalty Rewards",
      type: "Points",
      discount: "5x",
      validUntil: "2025-12-31",
      status: "Active",
      description: "Earn 5x points on every purchase throughout the year",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schemes & Offers</h1>
          <p className="text-muted-foreground">Manage promotional schemes and discount programs</p>
        </div>
        <Button>
          <Award className="h-4 w-4 mr-2" />
          Create New Scheme
        </Button>
      </div>

      <div className="grid gap-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    {scheme.name}
                  </CardTitle>
                  <CardDescription>{scheme.description}</CardDescription>
                </div>
                <Badge variant={scheme.status === "Active" ? "default" : "secondary"}>
                  {scheme.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{scheme.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-primary">{scheme.discount} Off</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Valid until {scheme.validUntil}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Scheme;
