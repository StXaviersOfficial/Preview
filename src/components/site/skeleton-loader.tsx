'use client';

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-xavier/10 bg-card p-4 sm:p-6">
      <div className="h-4 w-1/3 rounded-full bg-xavier/10 mb-3" />
      <div className="h-3 w-2/3 rounded-full bg-xavier/10 mb-2" />
      <div className="h-3 w-1/2 rounded-full bg-xavier/10" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-3 py-3 border-b border-xavier/5">
      <div className="h-8 w-8 rounded-full bg-xavier/10" />
      <div className="flex-1">
        <div className="h-3 w-1/3 rounded-full bg-xavier/10 mb-2" />
        <div className="h-2 w-1/2 rounded-full bg-xavier/10" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
