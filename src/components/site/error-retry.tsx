'use client';

import { RefreshCw } from "lucide-react";

export function ErrorRetry({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-muted-foreground mb-3">{message || "Something went wrong"}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full bg-xavier/10 px-4 py-2 text-xs font-medium text-xavier-dark hover:bg-xavier/20 transition-colors"
      >
        <RefreshCw className="size-3.5" />
        Try again
      </button>
    </div>
  );
}
