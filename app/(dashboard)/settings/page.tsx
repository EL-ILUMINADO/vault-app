import { prisma } from "@/lib/prisma-db";
import { Lock } from "lucide-react";
import { format } from "date-fns";
import { InviteForm } from "../../components/settings/invite-form";

export default async function SettingsPage() {
  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 px-4 py-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          System Settings
        </h2>
        <p className="text-slate-400">
          Manage team access and system preferences.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* LEFT COLUMN: Invite Form */}
        <div className="lg:col-span-1 space-y-6">
          <InviteForm />

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 opacity-75">
            <h3 className="flex items-center gap-2 font-semibold text-white mb-4">
              <Lock className="h-4 w-4 text-amber-500" />
              Security Policy
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Two-factor authentication is enforced for all Super Admin
              accounts. Session timeout is set to 15 minutes of inactivity.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Team List */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="font-semibold text-white">Team Members</h3>
              <p className="text-xs text-slate-500">
                Active accounts with dashboard access
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs">
                            {admin.fullName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {admin.fullName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700/20">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {admin.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                            Active
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {format(new Date(admin.createdAt), "MMM dd, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
