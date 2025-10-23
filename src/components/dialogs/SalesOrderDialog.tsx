import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SalesOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: any;
  onSuccess: () => void;
}

export const SalesOrderDialog = ({ open, onOpenChange, order, onSuccess }: SalesOrderDialogProps) => {
  const [formData, setFormData] = useState({
    customer: "",
    quotation_ref: "",
    amount: "",
    items: "",
    delivery_date: "",
    status: "Pending",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        customer: order.customer || "",
        quotation_ref: order.quotation_ref || "",
        amount: order.amount?.toString() || "",
        items: order.items?.toString() || "",
        delivery_date: order.delivery_date || "",
        status: order.status || "Pending",
        notes: order.notes || "",
      });
    } else {
      setFormData({
        customer: "",
        quotation_ref: "",
        amount: "",
        items: "",
        delivery_date: "",
        status: "Pending",
        notes: "",
      });
    }
  }, [order, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        items: parseInt(formData.items),
      };

      if (order) {
        const { error } = await supabase
          .from("sales_orders")
          .update(data)
          .eq("id", order.id);

        if (error) throw error;
        toast({ title: "Success", description: "Sales order updated successfully" });
      } else {
        const { error } = await supabase.from("sales_orders").insert([data]);

        if (error) throw error;
        toast({ title: "Success", description: "Sales order created successfully" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Sales Order" : "New Order"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotation_ref">Quotation Reference</Label>
              <Input
                id="quotation_ref"
                value={formData.quotation_ref}
                onChange={(e) => setFormData({ ...formData, quotation_ref: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">Number of Items</Label>
              <Input
                id="items"
                type="number"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <Input
                id="delivery_date"
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : order ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
