import { apiFetch } from "./client";
import type { ForecastsResponse } from "@/types";

export const fetchLatestForecasts = (
  fromDate: string,
  toDate: string,
): Promise<ForecastsResponse> =>
  apiFetch<ForecastsResponse>(
    `/api/v1/forecasts/latest?from_date=${fromDate}&to_date=${toDate}`,
  );
