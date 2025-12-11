import { prisma } from "@/lib/prisma-db";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { KycWorkspace } from "../components/kyc/kyc-workspace";

export default async function KycPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const activeId = searchParams.id;

  const queue = await prisma.customer.findMany({
    where: { kycStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  const activeCustomer = activeId
    ? queue.find((c) => c.id === activeId) || null
    : null;

  return (
    <div className="flex h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 relative">
      {/* LEFT PANE: The Queue */}

      <div
        className={cn(
          "w-full lg:w-80 border-r border-slate-800 flex-col",
          activeId ? "hidden lg:flex" : "flex"
        )}
      >
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="font-semibold text-white">Review Queue</h2>
          <p className="text-xs text-slate-500">
            {queue.length} applications pending
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              All caught up! 🎉
            </div>
          ) : (
            queue.map((customer) => (
              <Link
                key={customer.id}
                href={`/kyc?id=${customer.id}`}
                className={cn(
                  "block border-b border-slate-800 p-4 transition-colors hover:bg-slate-900",
                  activeId === customer.id
                    ? "bg-slate-900 border-l-2 border-l-emerald-500"
                    : "border-l-2 border-l-transparent"
                )}
              >
                <div className="flex justify-between">
                  <p className="font-medium text-slate-200">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <span className="text-xs text-slate-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {customer.email}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANE: The Workspace */}

      <div
        className={cn(
          "flex-1 bg-slate-950 overflow-y-auto",
          !activeId ? "hidden lg:block" : "block"
        )}
      >
        <KycWorkspace customer={activeCustomer} />
      </div>
    </div>
  );
}
