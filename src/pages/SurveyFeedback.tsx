import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SurveyDialog } from "@/components/dialogs/SurveyDialog";
import { format } from "date-fns";

const SurveyFeedback = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from("survey_feedback")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const columns = [
    { key: "survey_name", label: "Survey Name" },
    { key: "respondent_name", label: "Respondent" },
    { key: "rating", label: "Rating", render: (row: any) => `${row.rating} ⭐` },
    { key: "category", label: "Category" },
    { 
      key: "submitted_at", 
      label: "Submitted",
      render: (row: any) => format(new Date(row.submitted_at), "MMM dd, yyyy")
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Survey Feedback</h1>
          <p className="text-muted-foreground mt-2">Collect and analyze customer feedback</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <MessageSquareText className="h-4 w-4 mr-2" />
          Submit Feedback
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={surveys}
        loading={loading}
      />

      <SurveyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchSurveys}
      />
    </div>
  );
};

export default SurveyFeedback;
