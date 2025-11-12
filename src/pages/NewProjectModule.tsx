import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderPlus } from "lucide-react";

const NewProjectModule = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Project Module</h1>
        <p className="text-muted-foreground mt-2">Create and initialize new project modules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              Project Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active modules</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Module creation features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProjectModule;
