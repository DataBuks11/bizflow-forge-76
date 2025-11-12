import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";

const SurveyFeedback = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Survey Feedback</h1>
        <p className="text-muted-foreground mt-2">Collect and analyze customer feedback</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5" />
              Total Surveys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active surveys</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Survey Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Survey and feedback features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyFeedback;
