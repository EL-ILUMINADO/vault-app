"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Wallet } from "lucide-react";

export type WalletRow = {
  id: string;
  currency: string;
  balance: number;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isFrozen: boolean;
  };
  updatedAt: string;
};

export const columns: ColumnDef<WalletRow>[] = [
  {
    accessorKey: "id",
    header: "Wallet ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-slate-500" />
        <span className="font-mono text-xs text-slate-400">
          {row.original.id.slice(-8)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Owner",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-200">
          {row.original.customer.firstName} {row.original.customer.lastName}
        </span>
        <span className="text-xs text-slate-500">
          {row.original.customer.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded ${
          row.original.currency === "NGN"
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-blue-500/10 text-blue-500"
        }`}
      >
        {row.original.currency}
      </span>
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          <ArrowUpDown className="h-3 w-3" />
        </button>
      );
    },
    cell: ({ row }) => {
      const amount = row.original.balance;
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: row.original.currency,
      }).format(amount / 100);

      return <div className="font-bold text-slate-200">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`text-xs px-2 py-0.5 rounded-full border ${
          row.original.customer.isFrozen
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
        }`}
      >
        {row.original.customer.isFrozen ? "FROZEN" : "Active"}
      </span>
    ),
  },
];
