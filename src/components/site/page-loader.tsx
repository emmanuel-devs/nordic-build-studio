/** Branded pending state shown while a route resolves its data. */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-5">
      <div className="relative grid h-14 w-14 place-items-center">
        <span className="absolute inset-0 rounded-2xl border border-border" />
        <span className="brand-spin absolute inset-0 rounded-2xl border-2 border-transparent border-t-accent" />
        <span className="h-3.5 w-3.5 rounded-sm bg-ink" />
      </div>
      <p className="eyebrow brand-pulse">Loading</p>
    </div>
  );
}
