import { prisma } from "@/lib/prisma-db";
import { notFound } from "next/navigation";

import {
  CreditCard,
  Wallet,
  Activity,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ProfileHeader } from "@/app/components/customers/profile-header";
import { MetricCard } from "@/app/components/dashboard/metric-card";
import { DataTable } from "@/app/components/transactions/data-table";
import { columns } from "@/app/components/transactions/columns";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  // 1. Fetch DEEP data
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      wallets: true,
      transactions: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { customer: true }, // Needed for the columns type
      },
    },
  });

  if (!customer) {
    notFound();
  }

  // 2. Calculations
  const totalBalance = customer.wallets.reduce(
    (acc, w) => acc + Number(w.balance),
    0
  );
  const totalSpent = customer.transactions
    .filter((t) => t.type === "DEBIT" && t.status === "SUCCESS")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // Format money helper
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount / 100);
  };

  // 3. Transform transactions for the table
  const formattedTransactions = customer.transactions.map((tx) => ({
    id: tx.id,
    amount: Number(tx.amount),
    type: tx.type,
    status: tx.status,
    reference: tx.reference,
    customerName: `${customer.firstName} ${customer.lastName}`,
    email: customer.email,
    date: tx.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8 px-4 py-6">
      <ProfileHeader customer={customer} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Balance"
          value={formatMoney(totalBalance)}
          icon={Wallet}
        />
        <MetricCard
          label="Total Spent"
          value={formatMoney(totalSpent)}
          icon={CreditCard}
        />
        <MetricCard
          label="Transactions"
          value={customer.transactions.length.toString()}
          icon={Activity}
        />

        {/* Custom Card for KYC Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between h-full">
          <span className="text-sm font-medium text-slate-500">KYC Status</span>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-2xl font-bold text-white">
              {customer.kycStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Contact Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 h-full">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {customer.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="text-sm font-medium text-slate-200">
                    {customer.phoneNumber || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Joined On</p>
                  <p className="text-sm font-medium text-slate-200">
                    {format(new Date(customer.createdAt), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallets Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 h-full">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Wallets
            </h3>
            <div className="space-y-3">
              {customer.wallets.length === 0 ? (
                <p className="text-sm text-slate-500">No wallets found.</p>
              ) : (
                customer.wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between rounded bg-slate-800/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-500 shrink-0">
                        {wallet.currency}
                      </div>

                      <span className="text-sm text-slate-300 font-mono hidden sm:inline">
                        {wallet.id.slice(-6)}
                      </span>
                    </div>
                    <span className="font-bold text-white">
                      {formatMoney(Number(wallet.balance))}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-full min-w-0">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Transactions
          </h3>
          <DataTable columns={columns} data={formattedTransactions} />
        </div>
      </div>
    </div>
  );
}
