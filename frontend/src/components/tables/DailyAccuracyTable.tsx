import clsx from "clsx";
import { formatPct } from "@/utils/formatters";
import type { DailyMetrics } from "@/types";

interface Props {
  data: DailyMetrics[];
}

export const DailyAccuracyTable = ({ data }: Props) => {
  const maxMae = Math.max(...data.map((d) => d.mae_mw));

  return (
    <div className="overflow-x-auto rounded-xl border border-navy-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-700 bg-navy-900">
            <th className="px-4 py-3 text-left font-medium tracking-wide text-slate-400">Date</th>
            <th className="px-4 py-3 text-right font-medium tracking-wide text-slate-400">MAE (MW)</th>
            <th className="px-4 py-3 text-right font-medium tracking-wide text-slate-400">RMSE (MW)</th>
            <th className="px-4 py-3 text-right font-medium tracking-wide text-slate-400">MAPE</th>
            <th className="px-4 py-3 text-right font-medium tracking-wide text-slate-400">Bias (MW)</th>
            <th className="px-4 py-3 text-right font-medium tracking-wide text-slate-400">Hours</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.date}
              className={clsx(
                "border-b border-navy-700/50 transition-colors hover:bg-navy-800/50",
                idx % 2 === 0 ? "bg-navy-900/30" : "",
              )}
            >
              <td className="px-4 py-3 font-mono text-slate-300">{row.date}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Inline heat bar */}
                  <div className="h-1 w-16 overflow-hidden rounded-full bg-navy-700">
                    <div
                      className="h-full rounded-full bg-wind-500 transition-all"
                      style={{ width: `${(row.mae_mw / maxMae) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-slate-200">{Math.round(row.mae_mw)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono text-slate-200">
                {Math.round(row.rmse_mw)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-slate-200">
                {formatPct(row.mape_pct)}
              </td>
              <td
                className={clsx(
                  "px-4 py-3 text-right font-mono",
                  row.bias_mw >= 0 ? "text-emerald-400" : "text-amber-400",
                )}
              >
                {row.bias_mw >= 0 ? "+" : ""}
                {Math.round(row.bias_mw)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-slate-400">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
