"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuList } from "@/lib/menu-list";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white fixed left-0 top-0">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white mr-3">
          V
        </div>
        <span className="text-lg font-bold">Vault.</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-4">
          {menuList.map((group, i) => (
            <div key={i}>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.link;
                  return (
                    <Link
                      key={item.link}
                      href={item.link}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-900 text-emerald-500"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
            SA
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">Super Admin</p>
            <p className="text-xs text-slate-500">admin@vault.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
