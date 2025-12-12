import { Suspense } from "react";
import { prisma } from "@/lib/prisma-db";
import { CustomerTable } from "../../components/customers/customer-table";
import { columns } from "../../components/customers/columns";
import { Search } from "../../components/ui/search";
import { TableLoader } from "../../components/transactions/table-loader";

async function CustomerList({ query }: { query: string }) {
  // Fetch customers with search filter
  const data = await prisma.customer.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50, // Limit for demo
  });

  const formattedData = data.map((c) => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    email: c.email,
    phone: c.phoneNumber || "",
    kycStatus: c.kycStatus,
    riskLevel: c.riskLevel,
    joinedDate: c.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
        {data.length} Customers
      </div>
      <CustomerTable columns={columns} data={formattedData} />
    </div>
  );
}

export default async function CustomersPage(props: {
  searchParams: Promise<{ query?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Customers
          </h2>
          <p className="text-slate-400">Manage user accounts and compliance.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 text-sm font-medium">
          Add Customer
        </button>
      </div>

      <div className="w-full max-w-sm">
        <Search placeholder="Search name, email, or phone..." />
      </div>

      <Suspense key={query} fallback={<TableLoader />}>
        <CustomerList query={query} />
      </Suspense>
    </div>
  );
}
