import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProjectModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module?: any;
  onSuccess: () => void;
}

export const ProjectModuleDialog = ({ open, onOpenChange, module, onSuccess }: ProjectModuleDialogProps) => {
  const [formData, setFormData] = useState({
    module_name: "",
    module_code: "",
    description: "",
    version: "1.0.0",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (module) {
      setFormData(module);
    } else {
      setFormData({
        module_name: "",
        module_code: "",
        description: "",
        version: "1.0.0",
        status: "Active",
      });
    }
  }, [module, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (module) {
        const { error } = await supabase
          .from("project_modules")
          .update(formData)
          .eq("id", module.id);
        
        if (error) throw error;
        toast.success("Module updated successfully");
      } else {
        const { error } = await supabase
          .from("project_modules")
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Module created successfully");
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{module ? "Edit Module" : "Create Project Module"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="module_name">Module Name *</Label>
              <Input
                id="module_name"
                value={formData.module_name}
                onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module_code">Module Code *</Label>
              <Input
                id="module_code"
                value={formData.module_code}
                onChange={(e) => setFormData({ ...formData, module_code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : module ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
