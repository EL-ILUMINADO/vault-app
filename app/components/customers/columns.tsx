"use client";

import { ColumnDef } from "@tanstack/react-table";
import { KycStatus } from "@prisma/client"; // Import Enum
import { format } from "date-fns";
import { MoreHorizontal, ShieldAlert, Shield, BadgeCheck } from "lucide-react";

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: KycStatus;
  joinedDate: string;
  riskLevel: string; // "LOW", "HIGH"
};

export const columns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {/* Avatar generator */}
        <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
          {row.original.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-200">
            {row.getValue("name")}
          </span>
          <span className="text-xs text-slate-500">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "kycStatus",
    header: "KYC Status",
    cell: ({ row }) => {
      const status = row.getValue("kycStatus") as string;
      return (
        <div className="flex items-center gap-2">
          {status === "APPROVED" && (
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
          )}
          {status === "REJECTED" && (
            <ShieldAlert className="h-4 w-4 text-red-500" />
          )}
          {status === "PENDING" && (
            <Shield className="h-4 w-4 text-amber-500" />
          )}
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              status === "APPROVED"
                ? "bg-emerald-500/10 text-emerald-500"
                : status === "REJECTED"
                ? "bg-red-500/10 text-red-500"
                : "bg-amber-500/10 text-amber-500"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-slate-400 text-sm">
        {row.getValue("phone") || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "joinedDate",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-slate-500 text-xs">
        {format(new Date(row.getValue("joinedDate")), "MMM dd, yyyy")}
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
