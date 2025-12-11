"use client";

import { Search, Bell, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur transition-all">
      {/* SEARCH BAR */}
      <div className="flex w-full max-w-md items-center text-slate-500">
        <Search className="h-4 w-4" />
        <input
          type="text"
          placeholder="Search transactions, customers, or IDs..."
          className="ml-3 flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />
        <div className="flex gap-1 text-[10px] font-medium border border-slate-700 rounded px-1.5 py-0.5">
          <span className="text-slate-400">⌘</span>
          <span className="text-slate-400">K</span>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        <button className="relative text-slate-400 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <button className="text-slate-400 hover:text-white">
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
