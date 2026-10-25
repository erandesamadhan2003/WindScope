// ── Actuals ─────────────────────────────────────────────────────────────────

export interface ActualPoint {
  start_time: string;
  settlement_period: number;
  generation_mw: number;
}

export interface ActualsResponse {
  data: ActualPoint[];
  total_records: number;
  date_from: string;
  date_to: string;
}

// ── Forecasts ────────────────────────────────────────────────────────────────

export interface LatestForecastPoint {
  start_time: string;
  forecast_generation_mw: number;
  forecast_publish_time: string;
}

export interface ForecastsResponse {
  data: LatestForecastPoint[];
  total_records: number;
  decision_cutoff_hour_utc: number;
  description: string;
}

// ── Accuracy ─────────────────────────────────────────────────────────────────

export interface HourlyComparisonPoint {
  start_time: string;
  actual_generation_mw: number;
  forecast_generation_mw: number;
  error_mw: number;
  absolute_error_mw: number;
}

export interface DailyMetrics {
  date: string;
  mae_mw: number;
  rmse_mw: number;
  mape_pct: number | null;
  bias_mw: number;
  count: number;
}

export interface OverallMetrics {
  mae_mw: number;
  rmse_mw: number;
  mape_pct: number | null;
  bias_mw: number;
  count: number;
}

export interface AccuracyResponse {
  overall: OverallMetrics;
  daily: DailyMetrics[];
  hourly_comparison: HourlyComparisonPoint[];
}
