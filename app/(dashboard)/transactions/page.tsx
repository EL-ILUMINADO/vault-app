import { Suspense } from "react";

import { prisma } from "@/lib/prisma-db";
import { DataTable } from "../../components/transactions/data-table";
import { columns } from "../../components/transactions/columns";
import { TransactionPanel } from "../../components/transactions/transaction-panel";
import { Search } from "../../components/ui/search";
import { TableLoader } from "../../components/transactions/table-loader";

// 1. The List Component: Fetches data based on props
async function TransactionList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const take = 10; // Items per page
  const skip = (currentPage - 1) * take;

  // 2. Fetch Filtered Data
  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      take,
      skip,
      where: {
        OR: [
          { reference: { contains: query, mode: "insensitive" } },
          { customer: { firstName: { contains: query, mode: "insensitive" } } },
          { customer: { email: { contains: query, mode: "insensitive" } } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
    // Count total matches (useful if you add numbered pagination later)
    prisma.transaction.count({
      where: {
        OR: [
          { reference: { contains: query, mode: "insensitive" } },
          { customer: { firstName: { contains: query, mode: "insensitive" } } },
          { customer: { email: { contains: query, mode: "insensitive" } } },
        ],
      },
    }),
  ]);

  // 3. Transform Data for the Table
  const formattedData = data.map((tx) => ({
    id: tx.id,
    amount: Number(tx.amount),
    type: tx.type,
    status: tx.status,
    reference: tx.reference,
    customerName: `${tx.customer.firstName} ${tx.customer.lastName}`,
    email: tx.customer.email,
    date: tx.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Result Count */}
      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
        Found {total} records
      </div>

      <DataTable columns={columns} data={formattedData} />

      {/* The Slide-Over Panel */}
      <TransactionPanel transactions={data} />
    </div>
  );
}

// 4. The Main Page Component
// ✅ FIX: Props are defined as a Promise
export default async function TransactionsPage(props: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // ✅ FIX: We await the promise before accessing properties
  const searchParams = await props.searchParams;

  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;

  // Create a unique key for Suspense so the loader triggers on search/page change
  const suspenseKey = query + currentPage;

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            All Transactions
          </h2>
          <p className="text-slate-400">
            Monitor financial movements across the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 text-sm font-medium">
            Export CSV
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full max-w-sm">
        <Search placeholder="Search reference, name, or email..." />
      </div>

      {/* SUSPENSE BOUNDARY */}
      <Suspense key={suspenseKey} fallback={<TableLoader />}>
        <TransactionList query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
