export const CHART_COLORS = {
  actual: "#0EA5E9",      // sky blue — actual generation
  forecast: "#F59E0B",    // amber — forecasted generation
  error: "#EF4444",       // red — negative error (over-forecast)
  surplus: "#10B981",     // green — positive error (under-forecast)
  grid: "#1E3A5F",        // subtle grid lines
} as const;

export const METRIC_LABELS = {
  mae_mw: "MAE",
  rmse_mw: "RMSE",
  mape_pct: "MAPE",
  bias_mw: "Bias",
} as const;

export const METRIC_DESCRIPTIONS = {
  mae_mw: "Mean Absolute Error — average MW deviation regardless of direction",
  rmse_mw: "Root Mean Square Error — penalises large errors more heavily",
  mape_pct: "Mean Absolute Percentage Error — relative error as percentage",
  bias_mw: "Signed mean error. Positive = under-forecast (actual > forecast)",
} as const;
