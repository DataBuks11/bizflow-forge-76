import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { FolderKanban, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProjectManagementDialog } from "@/components/dialogs/ProjectManagementDialog";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const columns = [
    { key: "project_name", label: "Project Name" },
    { key: "project_code", label: "Code" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "progress", label: "Progress", render: (row: any) => `${row.progress}%` },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage projects and track progress</p>
        </div>
        <Button onClick={() => { setSelectedProject(null); setDialogOpen(true); }}>
          <FolderKanban className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        actions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedProject(row); setDialogOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      />

      <ProjectManagementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={selectedProject}
        onSuccess={fetchProjects}
      />
    </div>
  );
};

export default Project;
