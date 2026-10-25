import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO, differenceInDays } from "date-fns";
import { formatMW } from "@/utils/formatters";
import { CHART_COLORS } from "@/utils/constants";
import type { HourlyComparisonPoint } from "@/types";

interface Props {
  data: HourlyComparisonPoint[];
  dateFilter?: string;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const error =
    payload.length === 2 ? payload[0].value - payload[1].value : null;
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-800 p-3 shadow-xl">
      <p className="mb-2 font-mono text-xs text-slate-400">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300">{entry.name}:</span>
          <span className="font-mono font-medium text-slate-100">
            {formatMW(entry.value)}
          </span>
        </div>
      ))}
      {error !== null && (
        <div className="mt-2 border-t border-navy-700 pt-2 font-mono text-xs">
          <span className="text-slate-400">Error: </span>
          <span className={error >= 0 ? "text-emerald-400" : "text-amber-400"}>
            {formatMW(error)}
          </span>
        </div>
      )}
    </div>
  );
};

export const GenerationChart = ({ data, dateFilter }: Props) => {
  const filtered = dateFilter
    ? data.filter((d) => d.start_time.startsWith(dateFilter))
    : data;

  // Detect span of data to choose label format
  const isShortSpan = useMemo(() => {
    if (filtered.length < 2) return true;
    const first = parseISO(filtered[0].start_time);
    const last = parseISO(filtered[filtered.length - 1].start_time);
    return differenceInDays(last, first) <= 2;
  }, [filtered]);

  const isSparse = filtered.length <= 6;

  const chartData = filtered.map((d) => {
    const dt = parseISO(d.start_time);
    const label = dateFilter
      ? format(dt, "HH:mm")
      : isShortSpan
        ? format(dt, "dd MMM HH:mm")
        : format(dt, "dd MMM");
    return {
      time: label,
      Actual: Math.round(d.actual_generation_mw),
      Forecast: Math.round(d.forecast_generation_mw),
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No data available for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fontFamily: "JetBrains Mono", fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          interval={isSparse ? 0 : "preserveStartEnd"}
        />
        <YAxis
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}GW` : `${v}MW`
          }
          tick={{ fontSize: 11, fontFamily: "JetBrains Mono", fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }} />
        <Line
          type="monotone"
          dataKey="Actual"
          stroke={CHART_COLORS.actual}
          strokeWidth={2}
          dot={isSparse ? { r: 5, fill: CHART_COLORS.actual } : false}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="Forecast"
          stroke={CHART_COLORS.forecast}
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={isSparse ? { r: 5, fill: CHART_COLORS.forecast } : false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};