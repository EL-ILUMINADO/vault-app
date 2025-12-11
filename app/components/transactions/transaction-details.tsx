import { Transaction, Customer } from "@prisma/client";
import { CheckCircle, XCircle, Clock, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Extended type to include Customer relation
type TransactionWithCustomer = Transaction & { customer: Customer };

interface TransactionDetailsProps {
  transaction: TransactionWithCustomer;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  // Format Money
  const formatMoney = (amount: bigint) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(Number(amount) / 100);
  };

  return (
    <div className="space-y-8">
      {/* 1. STATUS HEADER */}
      <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
          {transaction.status === "SUCCESS" && (
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          )}
          {transaction.status === "FAILED" && (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
          {transaction.status === "PENDING" && (
            <Clock className="h-6 w-6 text-amber-500" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-white">
          {formatMoney(transaction.amount)}
        </h3>
        <span
          className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
            transaction.status === "SUCCESS"
              ? "bg-emerald-500/10 text-emerald-500"
              : transaction.status === "FAILED"
              ? "bg-red-500/10 text-red-500"
              : "bg-amber-500/10 text-amber-500"
          }`}
        >
          {transaction.status}
        </span>
      </div>

      {/* 2. KEY DETAILS GRID */}
      <div>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Transaction Details
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Reference" value={transaction.reference} isMono />
          <DetailItem
            label="Date"
            value={format(new Date(transaction.createdAt), "PPP p")}
          />
          <DetailItem label="Type" value={transaction.type} />
          <DetailItem label="Fee" value={formatMoney(transaction.fee)} />
        </div>
      </div>

      <div className="border-t border-slate-800 my-6" />

      {/* 3. CUSTOMER INFO */}
      <div>
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Customer
        </h4>
        <div className="rounded-lg border border-slate-800 p-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
              {transaction.customer.firstName[0]}
            </div>
            <div>
              <p className="font-medium text-white">
                {transaction.customer.firstName} {transaction.customer.lastName}
              </p>
              <p className="text-sm text-slate-400">
                {transaction.customer.email}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">KYC Status</span>
              <span className="text-white">
                {transaction.customer.kycStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Phone</span>
              <span className="text-white">
                {transaction.customer.phoneNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RISK ANALYSIS (Mock) */}
      <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Risk Analysis</p>
            <p className="text-xs text-red-400/80 mt-1">
              IP Address (192.168.1.1) is different from user&apos;s frequent
              location. Flagged for review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Sub-component
function DetailItem({
  label,
  value,
  isMono = false,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="rounded border border-slate-800 p-3 bg-slate-900/50">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p
        className={cn(
          "text-sm font-medium text-slate-200",
          isMono && "font-mono"
        )}
      >
        {value}
      </p>
    </div>
  );
}
