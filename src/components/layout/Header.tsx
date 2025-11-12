import { Bell, Search, User, Menu, LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const Header = ({ isSidebarOpen, onMenuClick }: { isSidebarOpen: boolean; onMenuClick: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [notifications] = useState([
    { id: 1, title: "New Order", message: "Order #1234 has been placed", time: "2 min ago", unread: true },
    { id: 2, title: "Stock Alert", message: "Low stock on Product A", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment Received", message: "Payment for Invoice #5678", time: "3 hours ago", unread: false },
  ]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-sm text-muted-foreground">
          Welcome <span className="font-semibold text-foreground">{user?.email?.split('@')[0].toUpperCase() || "PEPUP"}</span>
        </div>
        <Button 
          onClick={handleLogout}
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6"
        >
          Sign out
        </Button>
      </div>
    </header>
  );
};
