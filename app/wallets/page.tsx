import { prisma } from "@/lib/prisma-db";
import { Wallet, Globe, TrendingUp } from "lucide-react";
import { MetricCard } from "../components/dashboard/metric-card";
import { DataTable } from "../components/transactions/data-table";
import { columns } from "../components/wallets/columns";

export const revalidate = 60;

export default async function WalletsPage() {
  const aggregations = await prisma.wallet.groupBy({
    by: ["currency"],
    _sum: {
      balance: true,
    },
  });

  // Fetch "Whales" (Top 50 Richest Wallets)
  const wallets = await prisma.wallet.findMany({
    take: 50,
    orderBy: { balance: "desc" }, // Whales first
    include: {
      customer: true, // Need owner details
    },
  });

  // 3. Process Aggregates
  const totalNGN =
    aggregations.find((a) => a.currency === "NGN")?._sum.balance || BigInt(0);
  const totalUSD =
    aggregations.find((a) => a.currency === "USD")?._sum.balance || BigInt(0);

  // Helper
  const formatMoney = (amount: bigint, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
    }).format(Number(amount) / 100);
  };

  // 4. Transform for Table
  const formattedWallets = wallets.map((w) => ({
    id: w.id,
    currency: w.currency,
    balance: Number(w.balance),
    customer: {
      id: w.customer.id,
      firstName: w.customer.firstName,
      lastName: w.customer.lastName,
      email: w.customer.email,
      isFrozen: w.customer.isFrozen,
    },
    updatedAt: w.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Treasury & Wallets
        </h2>
        <p className="text-slate-400">
          Monitor system liquidity and high-value accounts.
        </p>
      </div>

      {/* TREASURY OVERVIEW */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* NGN LIQUIDITY */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="h-24 w-24 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total NGN Liquidity
            </p>
            <p className="mt-2 text-3xl font-bold text-white tracking-tight">
              {formatMoney(totalNGN, "NGN")}
            </p>
            <div className="mt-4 flex items-center text-xs text-emerald-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>System Liability</span>
            </div>
          </div>
        </div>

        {/* USD LIQUIDITY */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="h-24 w-24 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total USD Liquidity
            </p>
            <p className="mt-2 text-3xl font-bold text-white tracking-tight">
              {formatMoney(totalUSD, "USD")}
            </p>
            <div className="mt-4 flex items-center text-xs text-blue-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>International Float</span>
            </div>
          </div>
        </div>

        {/* WALLET COUNT */}
        <MetricCard
          label="Active Wallets"
          value={wallets.length === 50 ? "50+" : wallets.length.toString()}
          icon={Wallet}
          trend="Live Count"
          trendColor="neutral"
        />
      </div>

      {/* WHALE LIST */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Top 50 &quot;Whale&quot; Wallets
        </h3>
        <DataTable columns={columns} data={formattedWallets} />
      </div>
    </div>
  );
}
