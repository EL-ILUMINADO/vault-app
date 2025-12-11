"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, Clock, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { TxType, TxStatus } from "@prisma/client";

export type TransactionRow = {
  id: string;
  amount: number;
  type: TxType;
  status: TxStatus;
  reference: string;
  customerName: string;
  email: string;
  date: string;
};

export const columns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-400">
        {row.getValue("reference")}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-200">
          {row.getValue("customerName")}
        </span>
        <span className="text-xs text-slate-500">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={`text-xs font-bold px-2 py-1 rounded ${
          row.getValue("type") === "CREDIT"
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-slate-800 text-slate-400"
        }`}
      >
        {row.getValue("type")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center gap-2">
          {status === "SUCCESS" && (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          )}
          {status === "FAILED" && <XCircle className="h-4 w-4 text-red-500" />}
          {status === "PENDING" && <Clock className="h-4 w-4 text-amber-500" />}
          <span
            className={`text-sm font-medium ${
              status === "SUCCESS"
                ? "text-emerald-500"
                : status === "FAILED"
                ? "text-red-500"
                : "text-amber-500"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount / 100); // Convert Kobo to Naira

      return (
        <div className="text-right font-medium text-slate-200">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-slate-400 text-xs">
        {format(new Date(row.getValue("date")), "MMM dd, HH:mm")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <button className="text-slate-500 hover:text-white">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    ),
  },
];
