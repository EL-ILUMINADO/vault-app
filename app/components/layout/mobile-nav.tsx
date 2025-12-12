"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuList } from "@/lib/menu-list";
import { SignOutButton } from "@clerk/nextjs";
import { AdminUserPayload } from "@/types/admin";

type MobileNavProps = {
  user: AdminUserPayload | null;
};

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

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
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

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
                          onClick={() => setIsOpen(false)}
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
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                  {user.fullName[0]}
                </div>
                <div className="text-sm overflow-hidden">
                  <p className="font-medium text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <SignOutButton>
                <button
                  onClick={() => setIsSigningOut(true)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w- animate-spin" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
