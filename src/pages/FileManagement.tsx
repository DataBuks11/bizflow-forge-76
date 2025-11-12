import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Search,
  FileText,
  FileSpreadsheet,
  FileImage,
  Folder
} from "lucide-react";
import { FileUploadDialog } from "@/components/dialogs/FileUploadDialog";

const FileManagement = () => {
  const [files] = useState([
    {
      id: 1,
      name: "Q4_Sales_Report.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "John Smith",
      date: "2025-01-15",
      icon: FileText,
    },
    {
      id: 2,
      name: "Inventory_Data.xlsx",
      type: "Spreadsheet",
      size: "1.8 MB",
      uploadedBy: "Sarah Johnson",
      date: "2025-01-14",
      icon: FileSpreadsheet,
    },
    {
      id: 3,
      name: "Product_Images",
      type: "Folder",
      size: "45.2 MB",
      uploadedBy: "Mike Davis",
      date: "2025-01-10",
      icon: Folder,
    },
    {
      id: 4,
      name: "Store_Layout.png",
      type: "Image",
      size: "856 KB",
      uploadedBy: "Emily Brown",
      date: "2025-01-12",
      icon: FileImage,
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">File Management</h1>
          <p className="text-muted-foreground">Organize and manage your documents</p>
        </div>
        <FileUploadDialog />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search files..." className="pl-9" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <file.icon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.size} • Uploaded by {file.uploadedBy} on {file.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{file.type}</Badge>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileManagement;
