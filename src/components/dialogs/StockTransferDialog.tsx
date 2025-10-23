import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface StockTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function StockTransferDialog({ open, onOpenChange, onSuccess }: StockTransferDialogProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    product_id: "",
    from_location: "",
    to_location: "",
    quantity: "",
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
      setFormData({
        product_id: "",
        from_location: "",
        to_location: "",
        quantity: "",
      });
    }
  }, [open]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", "Active")
      .gt("stock", 0);
    setProducts(data || []);
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData(prev => ({
        ...prev,
        product_id: productId,
        from_location: product.location || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const product = products.find(p => p.id === formData.product_id);
      const transferQty = parseInt(formData.quantity) || 0;

      if (!product) {
        throw new Error("Product not found");
      }

      if (transferQty > product.stock) {
        throw new Error("Transfer quantity exceeds available stock");
      }

      // Update product location and stock
      const { error } = await supabase
        .from("products")
        .update({ location: formData.to_location })
        .eq("id", formData.product_id);

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: `Transferred ${transferQty} units from ${formData.from_location} to ${formData.to_location}` 
      });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stock Transfer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select
              value={formData.product_id}
              onValueChange={handleProductChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="from_location">From Location</Label>
            <Input
              id="from_location"
              value={formData.from_location}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to_location">To Location</Label>
            <Input
              id="to_location"
              value={formData.to_location}
              onChange={(e) => setFormData({ ...formData, to_location: e.target.value })}
              placeholder="Enter destination location"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Transferring..." : "Transfer Stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}