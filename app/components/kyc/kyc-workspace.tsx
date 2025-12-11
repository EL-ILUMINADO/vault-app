/* eslint-disable @next/next/no-img-element */
"use client";

import { Customer } from "@prisma/client";
import {
  Check,
  X,
  Shield,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { approveKyc, rejectKyc } from "@/app/actions/kyc";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import Link from "next/link";

export function KycWorkspace({ customer }: { customer: Customer | null }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!customer) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-500">
        <Shield className="mb-4 h-12 w-12 opacity-20" />
        <p>Select a customer from the queue to review.</p>
      </div>
    );
  }

  const handleAction = (action: "APPROVE" | "REJECT") => {
    startTransition(async () => {
      if (action === "APPROVE") {
        await approveKyc(customer.id);
      } else {
        await rejectKyc(customer.id);
      }
      // Clear the selection in URL after action
      router.replace("/kyc");
    });
  };

  return (
    <div className="h-full space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {customer.firstName} {customer.lastName}
          </h2>
          <p className="text-slate-400">
            KYC Application #{customer.id.slice(-8)}
          </p>
        </div>
        <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
          Pending Review
        </div>
      </div>

      {/* MOBILE HEADER: Back Button */}
      <div className="lg:hidden mb-4">
        <Link
          href="/kyc"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Queue
        </Link>
      </div>

      {/* DOCUMENT PREVIEW (Mocked for now) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Submitted ID
          </p>
          {/* Placeholder ID Card Image */}
          <div className="aspect-video w-full rounded-lg bg-slate-800 flex items-center justify-center relative overflow-hidden group">
            <img
              src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=0D8ABC&color=fff&size=512&font-size=0.33`}
              alt="ID Placeholder"
              className="opacity-50 blur-xl absolute inset-0 w-full h-full object-cover"
            />
            <span className="relative z-10 text-slate-400 font-medium">
              Identity Document
            </span>
          </div>
        </div>

        {/* CUSTOMER DATA */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              User Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-slate-500" />
                {customer.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-slate-500" />
                {customer.phoneNumber || "No phone linked"}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Calendar className="h-4 w-4 text-slate-500" />
                Registered: {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="mt-8 flex gap-4 border-t border-slate-800 pt-6">
        <button
          onClick={() => handleAction("APPROVE")}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {isPending ? <Spinner size="sm" /> : <Check className="h-4 w-4" />}
          Approve Application
        </button>

        <button
          onClick={() => handleAction("REJECT")}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-900/50 bg-red-900/20 py-3 font-semibold text-red-500 hover:bg-red-900/30 disabled:opacity-50"
        >
          {isPending ? <Spinner size="sm" /> : <X className="h-4 w-4" />}
          Reject
        </button>
      </div>
    </div>
  );
}
