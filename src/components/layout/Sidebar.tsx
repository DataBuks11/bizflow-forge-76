import { NavLink } from "react-router-dom";
import { 
  Building2, 
  Warehouse,
  BarChart3,
  ChevronDown,
  X,
  Database,
  PackageCheck,
  TrendingUp,
  CheckCircle2,
  Boxes
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Master",
    icon: Database,
    children: [
      { title: "Stock", icon: Warehouse, href: "/inventory" },
      { title: "Distributor Stock", icon: PackageCheck, href: "/distributor-stock" },
      { title: "GM Status Report", icon: TrendingUp, href: "/gm-status-report" },
      { title: "Distributor GM", icon: CheckCircle2, href: "/distributor-gm" },
      { title: "Distributor Fulfillment", icon: Boxes, href: "/distributor-fulfillment" },
    ],
  },
  { title: "Distributors", icon: Building2, href: "/distributors" },
  { title: "DMS", icon: Database, href: "/dms" },
  { title: "Reports", icon: BarChart3, href: "/reports" },
];

const distributorNavItems: NavItem[] = [];

export const Sidebar = ({ role = "admin", onClose }: { role?: "admin" | "distributor"; onClose?: () => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const items = role === "admin" ? navItems : distributorNavItems;

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.title} className="mb-0.5">
          <button
            onClick={() => toggleExpand(item.title)}
            className={cn(
              "flex items-center justify-between w-full px-4 py-2 text-sm transition-all",
              "text-sidebar-foreground hover:bg-white/10",
              level === 0 && "font-medium"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </button>
          {isExpanded && (
            <div className="space-y-0.5 bg-black/10">
              {item.children.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.href!}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-4 py-2 text-sm transition-all mb-0.5",
            level > 0 && "pl-12",
            isActive
              ? "bg-accent text-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-white/10"
          )
        }
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </NavLink>
    );
  };

  return (
    <aside className="w-64 sidebar-gradient flex flex-col shadow-xl">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-lg">K</span>
          </div>
          <h1 className="text-lg font-bold text-sidebar-foreground">
            {role === "admin" ? "DataBuks ERP" : "Distributor"}
          </h1>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-sidebar-foreground hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-4">
        <input 
          type="search" 
          placeholder="Type & Search" 
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {items.map(item => renderNavItem(item))}
      </nav>
    </aside>
  );
};
