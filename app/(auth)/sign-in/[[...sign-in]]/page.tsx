"use client";

import { Spinner } from "@/app/components/ui/spinner";
import dynamic from "next/dynamic";

export default function Page() {
  const SignIn = dynamic(
    () => import("@clerk/nextjs").then((mod) => mod.SignIn),
    { ssr: false, loading: () => <Spinner size="lg" /> }
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Login Box */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xl">
            V
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            Vault.
          </span>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-emerald-600 hover:bg-emerald-500 text-white",
              footerActionLink: "text-emerald-500 hover:text-emerald-400",
              card: "bg-slate-900 border border-slate-800 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton:
                "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-950 border-slate-800 text-white",
            },
          }}
        />
      </div>
    </div>
  );
}
