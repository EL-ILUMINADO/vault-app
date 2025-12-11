import { Spinner } from "../ui/spinner";

export function TableLoader() {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-900/50 h-[600px] flex flex-col items-center justify-center space-y-4">
      <div className="rounded-full bg-slate-800 p-4">
        <Spinner size="lg" />
      </div>
      <p className="text-slate-400 text-sm">Fetching transaction records...</p>
    </div>
  );
}
