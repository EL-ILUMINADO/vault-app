import { PrismaClient } from "@prisma/client";

import { Activity, CreditCard, Users, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { MetricCard } from "../components/dashboard/metric-card";
import { TransactionChart } from "../components/dashboard/transaction-chart";

const prisma = new PrismaClient();

//  see live data on every refresh
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // 1. Fetch all required data in parallel (Fastest way)
  const [totalVolume, txCount, pendingKyc, failedTx, recentTx, chartDataRaw] =
    await Promise.all([
      // A. Sum of all successful transactions
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
      }),

      // B. Total count of transactions
      prisma.transaction.count(),

      // C. Pending KYC customers
      prisma.customer.count({ where: { kycStatus: "PENDING" } }),

      // D. Failed transactions
      prisma.transaction.count({ where: { status: "FAILED" } }),

      // E. Recent 5 transactions for the list
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { customer: true },
      }),

      // F. Data for chart (Last 30 days)
      prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
        select: { createdAt: true, amount: true },
      }),
    ]);

  const chartMap = new Map<string, number>();

  chartDataRaw.forEach((tx) => {
    const date = format(tx.createdAt, "MMM dd");
    const current = chartMap.get(date) || 0;
    chartMap.set(date, current + Number(tx.amount));
  });

  const chartData = Array.from(chartMap)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .reverse();

  const formatMoney = (amount: bigint) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(Number(amount) / 100);
  };

  return (
    <div className="space-y-8 px-4 py-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Dashboard Overview
        </h2>
        <p className="text-slate-400">
          Real-time update of financial operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Volume"
          value={formatMoney(totalVolume._sum.amount || BigInt(0))}
          icon={Activity}
          trend="+12.5% from last month"
          trendColor="green"
        />
        <MetricCard
          label="Total Transactions"
          value={txCount.toLocaleString()}
          icon={CreditCard}
        />
        <MetricCard
          label="Pending KYC"
          value={pendingKyc.toString()}
          icon={Users}
          trend="Requires attention"
          trendColor="warning"
        />
        <MetricCard
          label="Failed Transactions"
          value={failedTx.toString()}
          icon={AlertTriangle}
          trend={`${((failedTx / (txCount || 1)) * 100).toFixed(
            1
          )}% failure rate`}
          trendColor="red"
        />
      </div>

      {/* 2. CHART SECTION */}
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
          <TransactionChart data={chartData} />
        </div>

        {/* 3. RECENT ACTIVITY (Simple Table) */}
        <div className="col-span-3 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {recentTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      tx.status === "SUCCESS"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : tx.status === "FAILED"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {tx.status === "SUCCESS"
                      ? "✓"
                      : tx.status === "FAILED"
                      ? "✕"
                      : "•"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {tx.customer.firstName} {tx.customer.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(tx.createdAt, "MMM dd, HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      tx.type === "CREDIT" ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {tx.type === "CREDIT" ? "+" : "-"}
                    {formatMoney(tx.amount)}
                  </p>
                  <p className="text-xs text-slate-500">{tx.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
