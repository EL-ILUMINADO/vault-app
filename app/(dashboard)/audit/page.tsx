import { prisma } from "@/lib/prisma-db";
import { format } from "date-fns";
import { History, ShieldAlert, UserCheck, FileText, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      admin: true,
    },
  });

  const getIcon = (action: string) => {
    if (action.includes("FREEZE"))
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (action.includes("KYC"))
      return <UserCheck className="h-4 w-4 text-emerald-500" />;
    return <FileText className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6 px-4 py-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          System Audit Logs
        </h2>
        <p className="text-slate-400">
          Immutable record of all administrative actions.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <History className="mb-4 h-12 w-12 opacity-20" />
            <p>No actions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Resource</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                  <th className="px-6 py-4 font-medium">Admin</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-800 p-2">
                          {getIcon(log.action)}
                        </div>
                        <span className="font-medium text-slate-200">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{log.resource}</span>
                      <span className="ml-2 font-mono text-xs text-slate-600">
                        {log.resourceId.slice(-6)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {log.admin?.fullName || "System Admin"}
                        </span>
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                          <Globe className="h-3 w-3" />{" "}
                          {log.ipAddress || "Unknown IP"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                      {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
