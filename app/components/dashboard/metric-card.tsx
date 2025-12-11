import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string; // e.g., "+12% from last month"
  trendColor?: "green" | "red" | "neutral" | "warning";
  icon: LucideIcon;
}

export function MetricCard({
  label,
  value,
  trend,
  trendColor = "neutral",
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
        </div>
        <div className="rounded-full bg-slate-800 p-3">
          <Icon className="h-5 w-5 text-emerald-500" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span
            className={cn(
              "font-medium",
              trendColor === "green" && "text-emerald-400",
              trendColor === "red" && "text-red-400",
              trendColor === "neutral" && "text-slate-500"
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
