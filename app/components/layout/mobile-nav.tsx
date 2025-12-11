"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuList } from "@/lib/menu-list";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white">
          V
        </div>
        <span className="text-lg font-bold text-white">Vault.</span>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-white"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* OVERLAY & DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div className="relative w-64 h-full bg-slate-950 border-r border-slate-800 p-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-white">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-6 flex-1 overflow-y-auto">
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
                          onClick={() => setIsOpen(false)} // Close on click
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

            <div className="pt-4 border-t border-slate-800">
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
          </div>
        </div>
      )}
    </div>
  );
}
