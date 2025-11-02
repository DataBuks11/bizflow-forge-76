import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Settings, Search, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [notifications] = useState([
    { id: 1, title: "New user signup", message: "John Doe just created an account", time: "2 mins ago", unread: true },
    { id: 2, title: "Payment received", message: "Invoice #1234 has been paid", time: "15 mins ago", unread: true },
    { id: 3, title: "Report generated", message: "Monthly sales report is ready", time: "1 hour ago", unread: false },
    { id: 4, title: "System update", message: "System maintenance completed", time: "3 hours ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen relative">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center text-white font-semibold">
              L
            </div>
            <span className="text-xl font-semibold">Lovable</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="glass-hover rounded-full relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs flex items-center justify-center rounded-full animate-glow-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 glass-card p-0 pointer-events-auto" align="end">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">{unreadCount} unread messages</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border/50">
                  <Button variant="ghost" className="w-full text-sm">
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" size="icon" className="glass-hover rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search anything..." 
              className="pl-12 glass-card h-12 border-border/50"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: "Total Revenue", value: "$45,231", change: "+20.1%", positive: true },
            { icon: Users, label: "Active Users", value: "2,340", change: "+12.5%", positive: true },
            { icon: DollarSign, label: "Sales", value: "$12,234", change: "-3.2%", positive: false },
            { icon: Activity, label: "Performance", value: "89.4%", change: "+8.1%", positive: true },
          ].map((stat, i) => (
            <Card key={i} className="glass-card glass-hover animate-fade-in" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className={`text-sm font-medium ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <Card className="lg:col-span-2 glass-card glass-hover animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart visualization area
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Panel */}
          <Card className="glass-card glass-hover animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New user signup", time: "2 mins ago" },
                  { action: "Payment received", time: "15 mins ago" },
                  { action: "Report generated", time: "1 hour ago" },
                  { action: "System update", time: "3 hours ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Cards */}
          <Card className="glass-card glass-hover animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full btn-gradient text-white">
                Create New Project
              </Button>
              <Button variant="outline" className="w-full glass-hover">
                View Reports
              </Button>
              <Button variant="outline" className="w-full glass-hover">
                Team Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 glass-card glass-hover animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle>Data Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Project Alpha", "Campaign Beta", "Initiative Gamma"].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="font-medium">{item}</span>
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
