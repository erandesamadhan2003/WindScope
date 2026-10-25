import { format, parseISO } from "date-fns";

export const formatMW = (mw: number): string =>
  `${mw.toLocaleString("en-GB", { maximumFractionDigits: 0 })} MW`;

export const formatMWShort = (mw: number): string => {
  if (Math.abs(mw) >= 1000) {
    return `${(mw / 1000).toFixed(1)} GW`;
  }
  return `${Math.round(mw)} MW`;
};

export const formatPct = (pct: number | null): string =>
  pct !== null ? `${pct.toFixed(1)}%` : "N/A";

export const formatDateTime = (iso: string): string =>
  format(parseISO(iso), "dd MMM HH:mm");

export const formatDate = (iso: string): string =>
  format(parseISO(iso), "dd MMM");

export const formatHour = (iso: string): string =>
  format(parseISO(iso), "HH:mm");

export const formatDateFull = (iso: string): string =>
  format(parseISO(iso), "dd MMM yyyy");
