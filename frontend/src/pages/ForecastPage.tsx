import { useState, useMemo } from "react";
import { Info } from "lucide-react";
import { useAccuracy } from "@/hooks/useAccuracy";
import { useDateRange } from "@/context/DateRangeContext";
import { GenerationChart } from "@/components/charts/GenerationChart";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { formatDate } from "@/utils/formatters";

export const ForecastPage = () => {
  const { data, isLoading, error } = useAccuracy();
  const { range } = useDateRange();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"day" | "all">("day");

  const availableDates = useMemo(() => {
    if (!data?.hourly_comparison.length) return [];
    const seen = new Set<string>();
    for (const pt of data.hourly_comparison) {
      seen.add(pt.start_time.slice(0, 10));
    }
    return Array.from(seen).sort();
  }, [data]);

  const activeDate = selectedDate ?? availableDates[0] ?? null;

  // Reset selected date when range changes
  useMemo(() => {
    setSelectedDate(null);
  }, [range]);

  if (isLoading) return <LoadingSpinner label="Loading forecast data…" />;
  if (error || !data) return <ErrorBanner message="Could not load forecast data." />;

  const filteredPoints =
    viewMode === "day" && activeDate
      ? data.hourly_comparison.filter((d) => d.start_time.startsWith(activeDate))
      : data.hourly_comparison;

  return (
    <div className="px-8 py-8">
      <div className="mb-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-wind-500">
          Forecast View · {range.fromDate === range.toDate ? range.fromDate : `${range.fromDate} → ${range.toDate}`}
        </p>
        <h1 className="text-2xl font-semibold text-slate-100">
          Day-Ahead Forecast vs Actuals
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Comparing the latest WINDFOR published forecast against FUELHH actual
          wind generation for overlapping periods.
        </p>
      </div>

      {/* API info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-wind-600/30 bg-wind-600/5 px-4 py-3 text-sm text-slate-400">
        <Info size={15} className="mt-0.5 shrink-0 text-wind-500" />
        <span>
          The Elexon BMRS streaming API provides <strong className="text-slate-300">current settlement day data only</strong>.
          Historical date ranges in the picker filter the display but the upstream API always returns live data.
          Overlapping hours between FUELHH actuals and WINDFOR forecasts:{" "}
          <span className="font-mono text-wind-400">{data.hourly_comparison.length} hours</span>.
        </span>
      </div>

      {availableDates.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-slate-400">No overlapping data available.</p>
          <p className="mt-1 text-sm text-slate-600">
            Try selecting today or the last 3 days.
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-navy-700 bg-navy-900 p-0.5">
              {(["day", "all"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
                    viewMode === mode
                      ? "bg-wind-600/30 text-wind-400"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {mode === "day" ? "By Day" : "All Data"}
                </button>
              ))}
            </div>

            {viewMode === "day" && (
              <select
                value={activeDate ?? ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-slate-300 focus:border-wind-600 focus:outline-none"
              >
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {formatDate(d + "T00:00:00Z")} — {
                      data.hourly_comparison.filter((pt) =>
                        pt.start_time.startsWith(d)
                      ).length
                    } pts
                  </option>
                ))}
              </select>
            )}

            <span className="font-mono text-xs text-slate-500">
              {filteredPoints.length} hourly point{filteredPoints.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-navy-700 bg-navy-800 p-6">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-slate-200">
                {viewMode === "day" && activeDate
                  ? `Wind Generation — ${formatDate(activeDate + "T00:00:00Z")} (Hourly)`
                  : "Wind Generation — All Available Data"}
              </h2>
              <p className="text-xs text-slate-500">
                Blue = actual generation · Amber dashed = forecast · MW
              </p>
            </div>
            <GenerationChart
              data={data.hourly_comparison}
              dateFilter={viewMode === "day" && activeDate ? activeDate : undefined}
            />
          </div>
        </>
      )}
    </div>
  );
};