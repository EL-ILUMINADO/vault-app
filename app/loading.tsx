import { Spinner } from "./components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-slate-950">
      {/* BRANDING ANIMATION */}
      <div className="mb-8 flex items-center gap-3 animate-pulse">
        <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center">
          <span className="text-slate-900 font-bold text-xl">V</span>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">
          Vault.
        </span>
      </div>

      {/* SPINNER */}
      <Spinner size="lg" />

      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
        Establishing secure connection...
      </p>
    </div>
  );
}
