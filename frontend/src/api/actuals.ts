import { apiFetch } from "./client";
import type { ActualsResponse } from "@/types";

export const fetchActuals = (
  fromDate: string,
  toDate: string,
): Promise<ActualsResponse> =>
  apiFetch<ActualsResponse>(
    `/api/v1/actuals?from_date=${fromDate}&to_date=${toDate}`,
  );
