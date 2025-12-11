import {
  LayoutDashboard,
  Receipt,
  Users,
  Wallet,
  ShieldCheck,
  FileText,
  Settings,
} from "lucide-react";

export const menuList = [
  {
    group: "Main Menu",
    items: [
      { link: "/", label: "Overview", icon: LayoutDashboard },
      { link: "/transactions", label: "Transactions", icon: Receipt },
      { link: "/customers", label: "Customers", icon: Users },
      { link: "/wallets", label: "Wallets", icon: Wallet },
      { link: "/kyc", label: "KYC Queue", icon: ShieldCheck },
      { link: "/audit", label: "Audit Logs", icon: FileText },
    ],
  },
  {
    group: "System",
    items: [{ link: "/settings", label: "Settings", icon: Settings }],
  },
];
