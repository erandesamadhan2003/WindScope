import { useState } from "react";
import { useAccuracy } from "@/hooks/useAccuracy";
import { DailyErrorChart } from "@/components/charts/DailyErrorChart";
import { DailyAccuracyTable } from "@/components/tables/DailyAccuracyTable";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Badge } from "@/components/ui/Badge";
import { formatMW, formatPct } from "@/utils/formatters";

type Metric = "mae_mw" | "rmse_mw" | "bias_mw";

const METRICS: { key: Metric; label: string; description: string }[] = [
  { key: "mae_mw", label: "MAE", description: "Average absolute error per day" },
  { key: "rmse_mw", label: "RMSE", description: "Root mean square error per day" },
  { key: "bias_mw", label: "Bias", description: "Signed error — direction of systematic error" },
];

export const AccuracyPage = () => {
  const { data, isLoading, error } = useAccuracy();
  const [activeMetric, setActiveMetric] = useState<Metric>("mae_mw");

  if (isLoading) return <LoadingSpinner label="Computing accuracy metrics…" />;
  if (error || !data) return <ErrorBanner message="Could not load accuracy data." />;

  const { overall, daily } = data;

  const worstDay = [...daily].sort((a, b) => b.mae_mw - a.mae_mw)[0];
  const bestDay = [...daily].sort((a, b) => a.mae_mw - b.mae_mw)[0];

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-wind-500">
          Accuracy Analysis · January 2026
        </p>
        <h1 className="text-2xl font-semibold text-slate-100">
          Forecast Error Quantification
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Use these metrics to size your procurement buffer when relying on day-ahead wind forecasts.
        </p>
      </div>

      {/* Overall summary strip */}
      <div className="mb-8 grid grid-cols-2 gap-3 rounded-xl border border-navy-700 bg-navy-800 p-5 sm:grid-cols-4">
        {[
          { label: "Overall MAE", value: formatMW(overall.mae_mw) },
          { label: "Overall RMSE", value: formatMW(overall.rmse_mw) },
          { label: "Overall MAPE", value: formatPct(overall.mape_pct) },
          {
            label: "Overall Bias",
            value: `${overall.bias_mw >= 0 ? "+" : ""}${formatMW(overall.bias_mw)}`,
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-0.5 font-mono text-xl font-medium text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Best / Worst */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
          <Badge variant="positive">Best Day</Badge>
          <p className="mt-2 font-mono text-lg font-medium text-emerald-400">
            {bestDay.date}
          </p>
          <p className="text-sm text-slate-400">
            MAE: <span className="font-mono text-slate-200">{formatMW(bestDay.mae_mw)}</span> ·
            MAPE: <span className="font-mono text-slate-200">{formatPct(bestDay.mape_pct)}</span>
          </p>
        </div>
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
          <Badge variant="warning">Worst Day</Badge>
          <p className="mt-2 font-mono text-lg font-medium text-amber-400">
            {worstDay.date}
          </p>
          <p className="text-sm text-slate-400">
            MAE: <span className="font-mono text-slate-200">{formatMW(worstDay.mae_mw)}</span> ·
            MAPE: <span className="font-mono text-slate-200">{formatPct(worstDay.mape_pct)}</span>
          </p>
        </div>
      </div>

      {/* Daily chart */}
      <div className="mb-8 rounded-xl border border-navy-700 bg-navy-800 p-6">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-sm font-medium text-slate-200">Daily Error Breakdown</h2>
          <div className="flex rounded-lg border border-navy-700 bg-navy-900 p-0.5">
            {METRICS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`rounded-md px-3 py-1 text-xs transition-colors ${
                  activeMetric === key
                    ? "bg-wind-600/30 text-wind-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="mb-4 text-xs text-slate-500">
          {METRICS.find((m) => m.key === activeMetric)?.description}
          {activeMetric === "bias_mw" && " · Green = actual > forecast (under-forecast)"}
        </p>
        <DailyErrorChart data={daily} metric={activeMetric} />
      </div>

      {/* Daily table */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-slate-200">Day-by-Day Breakdown</h2>
        <DailyAccuracyTable data={daily} />
      </div>
    </div>
  );
};
