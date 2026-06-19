import {
  LayoutDashboard,
  Receipt,
  Boxes,
  PackageSearch,
  Building2,
  ClipboardList,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Billing", href: "/billing", icon: Receipt },
  { label: "Inventory", href: "/inventory", icon: Boxes },
  { label: "Stock", href: "/stock", icon: PackageSearch },
  { label: "Clients & Firms", href: "/clients", icon: Building2 },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];
