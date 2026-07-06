export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-xavier/20 border-t-xavier animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading…</p>
      </div>
    </div>
  );
}
