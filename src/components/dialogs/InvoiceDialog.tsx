import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: any;
  onSuccess: () => void;
}

export const InvoiceDialog = ({ open, onOpenChange, invoice, onSuccess }: InvoiceDialogProps) => {
  const [formData, setFormData] = useState({
    customer: "",
    order_id: "",
    amount: "",
    tax: "",
    discount: "",
    status: "Pending",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoice) {
      setFormData({
        customer: invoice.customer || "",
        order_id: invoice.order_id || "",
        amount: invoice.amount?.toString() || "",
        tax: invoice.tax?.toString() || "",
        discount: invoice.discount?.toString() || "",
        status: invoice.status || "Pending",
        notes: invoice.notes || "",
      });
    } else {
      setFormData({
        customer: "",
        order_id: "",
        amount: "",
        tax: "",
        discount: "0",
        status: "Pending",
        notes: "",
      });
    }
  }, [invoice, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const tax = parseFloat(formData.tax);
      const discount = parseFloat(formData.discount || "0");
      const total = amount + tax - discount;

      const data = {
        customer: formData.customer,
        order_id: formData.order_id,
        amount,
        tax,
        discount,
        total,
        status: formData.status,
        notes: formData.notes,
      };

      if (invoice) {
        const { error } = await supabase
          .from("invoices")
          .update(data)
          .eq("id", invoice.id);

        if (error) throw error;
        toast({ title: "Success", description: "Invoice updated successfully" });
      } else {
        const { error } = await supabase.from("invoices").insert([data]);

        if (error) throw error;
        toast({ title: "Success", description: "Invoice created successfully" });
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
          <DialogTitle>{invoice ? "Edit Invoice" : "Generate Invoice"}</DialogTitle>
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
              <Label htmlFor="order_id">Order ID</Label>
              <Input
                id="order_id"
                value={formData.order_id}
                onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
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
              <Label htmlFor="tax">Tax</Label>
              <Input
                id="tax"
                type="number"
                step="0.01"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
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
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
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
              {loading ? "Saving..." : invoice ? "Update" : "Generate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
