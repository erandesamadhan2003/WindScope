export const LoadingSpinner = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-700 border-t-wind-500" />
    <span className="font-mono text-sm tracking-wide">{label}</span>
  </div>
);
