import { Activity, TrendingUp, Target, ArrowUpDown } from "lucide-react";
import { useAccuracy } from "@/hooks/useAccuracy";
import { useDateRange } from "@/context/DateRangeContext";
import { MetricCard } from "@/components/cards/MetricCard";
import { GenerationChart } from "@/components/charts/GenerationChart";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { formatMW, formatPct } from "@/utils/formatters";

export const DashboardPage = () => {
  const { data, isLoading, error } = useAccuracy();
  const { range } = useDateRange();

  if (isLoading) return <LoadingSpinner label="Fetching wind generation data…" />;
  if (error || !data) return <ErrorBanner message="Could not load accuracy data." />;

  const { overall, hourly_comparison } = data;

  const rangeLabel =
    range.fromDate === range.toDate
      ? range.fromDate
      : `${range.fromDate} → ${range.toDate}`;

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-wind-500">
          Overview · {rangeLabel}
        </p>
        <h1 className="text-2xl font-semibold text-slate-100">
          Wind Generation Procurement Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Day-ahead forecast performance for GB national wind generation ·{" "}
          <span className="font-mono text-slate-400">
            {overall.count} hourly observations
          </span>
        </p>
      </div>

      {/* Metric cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="MAE"
          value={formatMW(overall.mae_mw)}
          description="Average absolute deviation between forecast and actual generation"
          icon={Activity}
          trend="neutral"
        />
        <MetricCard
          label="RMSE"
          value={formatMW(overall.rmse_mw)}
          description="Penalises large forecast misses — a conservative risk measure"
          icon={TrendingUp}
          trend="neutral"
        />
        <MetricCard
          label="MAPE"
          value={formatPct(overall.mape_pct)}
          description="Relative forecast error as a percentage of actual generation"
          icon={Target}
          trend="neutral"
        />
        <MetricCard
          label="Bias"
          value={`${overall.bias_mw >= 0 ? "+" : ""}${formatMW(overall.bias_mw)}`}
          description="Positive = wind under-forecast on average (you needed more than predicted)"
          icon={ArrowUpDown}
          trend={overall.bias_mw >= 0 ? "bad" : "good"}
          sub={overall.bias_mw >= 0 ? "Under-forecast tendency" : "Over-forecast tendency"}
        />
      </div>

      {/* No data state */}
      {hourly_comparison.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-slate-400">No overlapping forecast and actual data for this range.</p>
          <p className="mt-1 text-sm text-slate-600">
            The Elexon BMRS stream provides current-day data only. Try selecting today or yesterday.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-navy-700 bg-navy-800 p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-medium text-slate-200">
                Actuals vs Day-Ahead Forecast
              </h2>
              <p className="text-xs text-slate-500">
                {rangeLabel} · Hourly averages (MW) ·{" "}
                {hourly_comparison.length} data points
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-0.5 w-4"
                  style={{ backgroundColor: "#0EA5E9" }}
                />
                Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-0.5 w-4 border-t-2 border-dashed border-amber-400"
                />
                Forecast
              </span>
            </div>
          </div>
          <GenerationChart data={hourly_comparison} />
        </div>
      )}
    </div>
  );
};