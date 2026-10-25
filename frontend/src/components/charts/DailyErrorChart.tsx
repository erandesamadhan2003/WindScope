import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { formatDate } from "@/utils/formatters";
import { CHART_COLORS } from "@/utils/constants";
import type { DailyMetrics } from "@/types";

interface Props {
  data: DailyMetrics[];
  metric: "mae_mw" | "rmse_mw" | "bias_mw";
}

export const DailyErrorChart = ({ data, metric }: Props) => {
  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    value: d[metric],
  }));

  const isBias = metric === "bias_mw";

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tickFormatter={(v) => `${Math.round(v)}`}
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          tickLine={false}
          axisLine={false}
          width={44}
        />
        <Tooltip
          formatter={(value: number) => [`${Math.round(value)} MW`, metric.toUpperCase()]}
          contentStyle={{
            backgroundColor: "#1C2B3A",
            border: "1px solid #1E3A5F",
            borderRadius: "8px",
            fontFamily: "JetBrains Mono",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#94A3B8" }}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {chartData.map((entry, index) =>
            isBias ? (
              <Cell
                key={index}
                fill={entry.value >= 0 ? CHART_COLORS.surplus : CHART_COLORS.error}
              />
            ) : (
              <Cell key={index} fill={CHART_COLORS.actual} />
            ),
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
