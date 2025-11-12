import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Megaphone, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CampaignDialog } from "@/components/dialogs/CampaignDialog";

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const columns = [
    { key: "campaign_name", label: "Campaign Name" },
    { key: "campaign_type", label: "Type" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "budget", label: "Budget", render: (row: any) => row.budget ? `$${row.budget}` : "N/A" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-2">Create and manage marketing campaigns</p>
        </div>
        <Button onClick={() => { setSelectedCampaign(null); setDialogOpen(true); }}>
          <Megaphone className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={campaigns}
        loading={loading}
        actions={(row) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedCampaign(row); setDialogOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      />

      <CampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        campaign={selectedCampaign}
        onSuccess={fetchCampaigns}
      />
    </div>
  );
};

export default Campaign;
