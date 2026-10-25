import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  variant?: "neutral" | "positive" | "negative" | "warning";
}

const variants = {
  neutral: "bg-navy-700 text-slate-300",
  positive: "bg-emerald-950 text-emerald-400 border border-emerald-900/50",
  negative: "bg-red-950 text-red-400 border border-red-900/50",
  warning: "bg-amber-950 text-amber-400 border border-amber-900/50",
};

export const Badge = ({ children, variant = "neutral" }: Props) => (
  <span
    className={clsx(
      "inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-medium",
      variants[variant],
    )}
  >
    {children}
  </span>
);
