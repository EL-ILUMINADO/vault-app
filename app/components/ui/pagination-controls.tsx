"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  pageIndex: number; // 0-based index
  pageSize: number;
  totalCount: number;
}

export function PaginationControls({
  canPrevious,
  canNext,
  onPrevious,
  onNext,
  pageIndex,
  pageSize,
  totalCount,
}: PaginationControlsProps) {
  // Calculate display numbers
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* LEFT: Text Info */}
      <div className="text-sm text-slate-400">
        Showing <span className="font-medium text-white">{startRow}</span> to{" "}
        <span className="font-medium text-white">{endRow}</span> of{" "}
        <span className="font-medium text-white">{totalCount}</span> results
      </div>

      {/* RIGHT: Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevious}
          disabled={!canPrevious}
          className="rounded border border-slate-800 bg-slate-900 px-3 py-1 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </div>
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="rounded border border-slate-800 bg-slate-900 px-3 py-1 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-1">
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
