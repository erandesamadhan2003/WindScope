import { apiFetch } from "./client";
import type { AccuracyResponse } from "@/types";

export const fetchAccuracy = (
  fromDate: string,
  toDate: string,
): Promise<AccuracyResponse> =>
  apiFetch<AccuracyResponse>(
    `/api/v1/accuracy?from_date=${fromDate}&to_date=${toDate}`,
  );
