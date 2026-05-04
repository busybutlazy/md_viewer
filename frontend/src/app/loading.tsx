export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="h-52 rounded-3xl bg-[var(--surface-strong)]" />
        <div className="h-80 rounded-3xl bg-[var(--surface-strong)]" />
      </div>
    </div>
  );
}
