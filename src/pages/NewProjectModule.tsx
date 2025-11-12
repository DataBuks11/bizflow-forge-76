import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { FolderPlus, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProjectModuleDialog } from "@/components/dialogs/ProjectModuleDialog";

const NewProjectModule = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from("project_modules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setModules(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const columns = [
    { key: "module_name", label: "Module Name" },
    { key: "module_code", label: "Code" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Modules</h1>
          <p className="text-muted-foreground mt-2">Create and manage project modules</p>
        </div>
        <Button onClick={() => { setSelectedModule(null); setDialogOpen(true); }}>
          <FolderPlus className="h-4 w-4 mr-2" />
          Create Module
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={modules}
        loading={loading}
        actions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedModule(row); setDialogOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      />

      <ProjectModuleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        module={selectedModule}
        onSuccess={fetchModules}
      />
    </div>
  );
};

export default NewProjectModule;
