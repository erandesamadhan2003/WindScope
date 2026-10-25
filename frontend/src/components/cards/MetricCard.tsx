import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: "neutral" | "good" | "bad";
  sub?: string;
}

export const MetricCard = ({
  label,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  sub,
}: Props) => {
  const valueColor = {
    neutral: "text-wind-400",
    good: "text-emerald-400",
    bad: "text-amber-400",
  }[trend];

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-800 p-5 transition-colors hover:border-navy-600">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <div className="rounded-lg bg-navy-700 p-2">
          <Icon size={14} className="text-slate-400" />
        </div>
      </div>

      <p className={clsx("font-mono text-3xl font-medium tracking-tight", valueColor)}>
        {value}
      </p>

      {sub && (
        <p className="mt-1 font-mono text-xs text-slate-500">{sub}</p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  );
};
