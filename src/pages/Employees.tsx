import { useState, useEffect } from "react";
import { DataTable, StatusBadge } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EmployeeDialog } from "@/components/dialogs/EmployeeDialog";

const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleView = (employee: any) => {
    toast({ 
      title: "Employee Details", 
      description: `Viewing details for ${employee.name}` 
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <DataTable
          title="Employee List"
          columns={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
            { key: "department", label: "Department" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { 
              key: "status", 
              label: "Status",
              render: (value) => <StatusBadge status={value} />
            },
          ]}
          data={employees}
          actions={(row) => (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => handleView(row)}>View</Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
            </div>
          )}
        />
      )}

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />
    </div>
  );
};

export default Employees;
