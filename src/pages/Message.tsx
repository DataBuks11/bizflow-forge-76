import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Clock } from "lucide-react";

const Message = () => {
  const [messages] = useState([
    {
      id: 1,
      sender: "John Smith",
      subject: "Q4 Sales Report",
      message: "Please review the latest sales figures for Q4.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      subject: "Inventory Update",
      message: "Stock levels need to be reviewed for next week's order.",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      sender: "Mike Davis",
      subject: "Team Meeting",
      message: "Reminder: Team meeting scheduled for tomorrow at 10 AM.",
      time: "1 day ago",
      unread: false,
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Internal communication and notifications</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className={msg.unread ? "border-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {msg.sender}
                      {msg.unread && <Badge variant="default">New</Badge>}
                    </CardTitle>
                    <CardDescription className="font-medium">
                      {msg.subject}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {msg.time}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>Compose a new message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Recipient" />
            <Input placeholder="Subject" />
            <Textarea placeholder="Type your message..." rows={8} />
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Message;
