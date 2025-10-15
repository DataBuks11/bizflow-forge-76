import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Building2, 
  UsersRound, 
  ClipboardList,
  UserCheck,
  Calendar,
  Wallet,
  TrendingUp,
  Target,
  MapPin,
  Warehouse,
  FileText,
  Receipt,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Products", icon: Package, href: "/products" },
  { title: "Customers", icon: Users, href: "/customers" },
  { title: "Distributors", icon: Building2, href: "/distributors" },
  { title: "Employees", icon: UsersRound, href: "/employees" },
  {
    title: "HRM",
    icon: UserCheck,
    children: [
      { title: "Attendance", icon: Calendar, href: "/hrm/attendance" },
      { title: "Leave", icon: ClipboardList, href: "/hrm/leave" },
      { title: "Payroll", icon: Wallet, href: "/hrm/payroll" },
      { title: "Performance", icon: TrendingUp, href: "/hrm/performance" },
    ],
  },
  {
    title: "CRM",
    icon: ClipboardList,
    children: [
      { title: "Leads", icon: Users, href: "/crm/leads" },
      { title: "Quotations", icon: FileText, href: "/crm/quotations" },
      { title: "Sales Orders", icon: Receipt, href: "/crm/orders" },
    ],
  },
  { title: "Sales Target", icon: Target, href: "/sales-target" },
  { title: "Location", icon: MapPin, href: "/location-tracking" },
  { title: "Inventory", icon: Warehouse, href: "/inventory" },
  { title: "Billing", icon: Receipt, href: "/billing" },
  { title: "Expenses", icon: Wallet, href: "/expenses" },
  { title: "Reports", icon: BarChart3, href: "/reports" },
];

const distributorNavItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/distributor/dashboard" },
  { title: "Orders", icon: Receipt, href: "/distributor/orders" },
  { title: "Employees", icon: UsersRound, href: "/distributor/employees" },
  { title: "Expenses", icon: Wallet, href: "/distributor/expenses" },
  { title: "Products", icon: Package, href: "/distributor/products" },
];

export const Sidebar = ({ role = "admin" }: { role?: "admin" | "distributor" }) => {
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
        <div key={item.title} className="mb-1">
          <button
            onClick={() => toggleExpand(item.title)}
            className={cn(
              "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors rounded-lg",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              level > 0 && "pl-8"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-90"
            )} />
          </button>
          {isExpanded && (
            <div className="mt-1 space-y-1">
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
            "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-lg mb-1",
            level > 0 && "pl-12",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )
        }
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </NavLink>
    );
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          {role === "admin" ? "ERP System" : "Distributor Portal"}
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {items.map(item => renderNavItem(item))}
      </nav>
    </aside>
  );
};
