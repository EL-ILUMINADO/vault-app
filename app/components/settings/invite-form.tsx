"use client";

import { createAdmin, ActionState } from "@/app/actions/settings";
import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { Spinner } from "../ui/spinner";

const initialState: ActionState = {
  success: false,
  message: "",
  error: "",
};

export function InviteForm() {
  const [state, formAction, isPending] = useActionState(
    createAdmin,
    initialState
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h3 className="flex items-center gap-2 font-semibold text-white mb-4">
        <UserPlus className="h-4 w-4 text-emerald-500" />
        Invite Team Member
      </h3>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500">
            Full Name
          </label>
          <input
            name="fullName"
            placeholder="e.g. Sarah Connor"
            className="mt-1 w-full rounded bg-slate-950 border border-slate-800 p-2 text-sm text-white focus:border-emerald-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            placeholder="sarah@vault.app"
            className="mt-1 w-full rounded bg-slate-950 border border-slate-800 p-2 text-sm text-white focus:border-emerald-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Role</label>
          <select
            name="role"
            className="mt-1 w-full rounded bg-slate-950 border border-slate-800 p-2 text-sm text-white focus:border-emerald-500 outline-none"
          >
            <option value="ADMIN">Admin (Standard)</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="SUPPORT">Customer Support</option>
          </select>
        </div>

        {/* FEEDBACK MESSAGES */}
        {state.error && (
          <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center rounded bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {isPending ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            "Send Invite"
          )}
        </button>
      </form>
    </div>
  );
}
