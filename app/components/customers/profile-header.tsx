"use client";

import { Customer } from "@prisma/client";
import { toggleCustomerFreeze } from "@/app/actions/customer";
import { Lock, Unlock, AlertTriangle } from "lucide-react";
import { useTransition } from "react";
import { Spinner } from "../ui/spinner";

export function ProfileHeader({ customer }: { customer: Customer }) {
  const [isPending, startTransition] = useTransition();

  const handleToggleFreeze = () => {
    const action = customer.isFrozen ? "Unfreeze" : "Freeze";
    const confirm = window.confirm(
      `Are you sure you want to ${action} this account?`
    );

    if (confirm) {
      startTransition(async () => {
        await toggleCustomerFreeze(customer.id, customer.isFrozen);
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-slate-800 pb-6 gap-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-300">
          {customer.firstName[0]}
          {customer.lastName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {customer.firstName} {customer.lastName}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
            <span className="text-slate-400 text-sm break-all">
              {customer.email}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-xs">
              {customer.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS SECTION */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        {customer.isFrozen && (
          <div className="flex items-center justify-center gap-2 rounded-md bg-red-500/10 px-3 py-3 text-sm font-medium text-red-500 border border-red-500/20 text-center">
            <AlertTriangle className="h-4 w-4" />
            <span className="whitespace-nowrap">Account Frozen</span>
          </div>
        )}

        <button
          onClick={handleToggleFreeze}
          disabled={isPending}
          className={`flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-colors w-full sm:w-auto ${
            customer.isFrozen
              ? "bg-slate-800 text-white hover:bg-slate-700"
              : "bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/30"
          }`}
        >
          {isPending ? (
            <Spinner size="sm" />
          ) : customer.isFrozen ? (
            <>
              <Unlock className="h-4 w-4" /> Unfreeze Account
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Freeze Account
            </>
          )}
        </button>
      </div>
    </div>
  );
}
