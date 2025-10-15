import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
  return (
    <header className="h-16 border-b border-white/20 dark:border-gray-700/20 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search..." 
          className="border-0 focus-visible:ring-0"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full shadow-lg" />
        </Button>
        
        <Button variant="ghost" className="gap-2 rounded-full">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">Admin User</span>
        </Button>
      </div>
    </header>
  );
};
