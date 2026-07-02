export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center pt-20">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-border-subtle" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-core animate-spin" />
        </div>
        <p className="font-code text-text-muted text-sm uppercase tracking-wider">
          Loading…
        </p>
      </div>
    </div>
  );
}
