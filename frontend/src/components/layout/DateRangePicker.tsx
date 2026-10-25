import { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { useDateRange } from "@/context/DateRangeContext";

// Preset helpers
const fmt = (d: Date) => d.toISOString().slice(0, 10);

const presets = [
  {
    label: "Today",
    range: () => {
      const t = fmt(new Date());
      return { fromDate: t, toDate: t };
    },
  },
  {
    label: "Last 3 days",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 2);
      return { fromDate: fmt(from), toDate: fmt(to) };
    },
  },
  {
    label: "Last 7 days",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 6);
      return { fromDate: fmt(from), toDate: fmt(to) };
    },
  },
  {
    label: "Last 30 days",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 29);
      return { fromDate: fmt(from), toDate: fmt(to) };
    },
  },
  {
    label: "Jan 2026",
    range: () => ({ fromDate: "2026-01-01", toDate: "2026-01-31" }),
  },
];

export const DateRangePicker = () => {
  const { range, setRange } = useDateRange();
  const [draft, setDraft] = useState(range);
  const [open, setOpen] = useState(false);

  const apply = () => {
    if (draft.fromDate && draft.toDate && draft.fromDate <= draft.toDate) {
      setRange(draft);
      setOpen(false);
    }
  };

  const applyPreset = (preset: (typeof presets)[0]) => {
    const r = preset.range();
    setDraft(r);
    setRange(r);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-800 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-wind-600 hover:text-slate-100"
      >
        <Calendar size={13} className="text-wind-500" />
        <span className="font-mono">
          {range.fromDate}
          {range.fromDate !== range.toDate && (
            <> → {range.toDate}</>
          )}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-xl border border-navy-700 bg-navy-900 p-4 shadow-2xl">
            {/* Presets */}
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
              Quick select
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="rounded-md border border-navy-700 bg-navy-800 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:border-wind-600 hover:text-wind-400"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom range */}
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
              Custom range
            </p>
            <div className="space-y-2">
              <div>
                <label className="mb-1 block text-xs text-slate-500">From</label>
                <input
                  type="date"
                  value={draft.fromDate}
                  max={draft.toDate}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, fromDate: e.target.value }))
                  }
                  className="w-full rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 font-mono text-sm text-slate-200 focus:border-wind-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">To</label>
                <input
                  type="date"
                  value={draft.toDate}
                  min={draft.fromDate}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, toDate: e.target.value }))
                  }
                  className="w-full rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 font-mono text-sm text-slate-200 focus:border-wind-600 focus:outline-none"
                />
              </div>
            </div>

            {draft.fromDate > draft.toDate && (
              <p className="mt-2 text-xs text-red-400">
                "From" must be before "To"
              </p>
            )}

            <button
              onClick={apply}
              disabled={!draft.fromDate || !draft.toDate || draft.fromDate > draft.toDate}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-wind-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-wind-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw size={13} />
              Apply Range
            </button>
          </div>
        </>
      )}
    </div>
  );
};