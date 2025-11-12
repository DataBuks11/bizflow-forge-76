import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SuperDistributorStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock?: any;
  onSuccess: () => void;
}

export const SuperDistributorStockDialog = ({ open, onOpenChange, stock, onSuccess }: SuperDistributorStockDialogProps) => {
  const [formData, setFormData] = useState({
    super_distributor_name: "",
    super_distributor_code: "",
    item_name: "",
    item_code: "",
    category: "",
    brand: "",
    quantity_cases: "",
    quantity_pcs: "",
    case_size: "",
    stock_value: "",
    batch: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stock) {
      setFormData({
        ...stock,
        quantity_cases: stock.quantity_cases.toString(),
        quantity_pcs: stock.quantity_pcs.toString(),
        case_size: stock.case_size.toString(),
        stock_value: stock.stock_value.toString(),
      });
    } else {
      setFormData({
        super_distributor_name: "",
        super_distributor_code: "",
        item_name: "",
        item_code: "",
        category: "",
        brand: "",
        quantity_cases: "",
        quantity_pcs: "",
        case_size: "",
        stock_value: "",
        batch: "",
      });
    }
  }, [stock, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        super_distributor_name: formData.super_distributor_name,
        super_distributor_code: formData.super_distributor_code,
        item_name: formData.item_name,
        item_code: formData.item_code,
        category: formData.category,
        brand: formData.brand,
        quantity_cases: parseInt(formData.quantity_cases) || 0,
        quantity_pcs: parseInt(formData.quantity_pcs) || 0,
        case_size: parseInt(formData.case_size) || 0,
        stock_value: parseFloat(formData.stock_value) || 0,
        batch: formData.batch,
      };

      if (stock) {
        const { error } = await supabase
          .from("super_distributor_stock")
          .update(data)
          .eq("id", stock.id);
        
        if (error) throw error;
        toast.success("Stock updated successfully");
      } else {
        const { error } = await supabase
          .from("super_distributor_stock")
          .insert([data]);
        
        if (error) throw error;
        toast.success("Stock added successfully");
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{stock ? "Edit Stock" : "Add Stock"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="super_distributor_name">Super Distributor Name *</Label>
              <Input
                id="super_distributor_name"
                value={formData.super_distributor_name}
                onChange={(e) => setFormData({ ...formData, super_distributor_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="super_distributor_code">Super Distributor Code *</Label>
              <Input
                id="super_distributor_code"
                value={formData.super_distributor_code}
                onChange={(e) => setFormData({ ...formData, super_distributor_code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item_name">Item Name *</Label>
              <Input
                id="item_name"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item_code">Item Code *</Label>
              <Input
                id="item_code"
                value={formData.item_code}
                onChange={(e) => setFormData({ ...formData, item_code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity_cases">Quantity (Cases) *</Label>
              <Input
                id="quantity_cases"
                type="number"
                value={formData.quantity_cases}
                onChange={(e) => setFormData({ ...formData, quantity_cases: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity_pcs">Quantity (Pcs) *</Label>
              <Input
                id="quantity_pcs"
                type="number"
                value={formData.quantity_pcs}
                onChange={(e) => setFormData({ ...formData, quantity_pcs: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="case_size">Case Size *</Label>
              <Input
                id="case_size"
                type="number"
                value={formData.case_size}
                onChange={(e) => setFormData({ ...formData, case_size: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_value">Stock Value *</Label>
              <Input
                id="stock_value"
                type="number"
                step="0.01"
                value={formData.stock_value}
                onChange={(e) => setFormData({ ...formData, stock_value: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : stock ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
