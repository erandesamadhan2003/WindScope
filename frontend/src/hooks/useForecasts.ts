import { useQuery } from "@tanstack/react-query";
import { fetchLatestForecasts } from "@/api/forecasts";
import { useDateRange } from "@/context/DateRangeContext";

export const useForecasts = () => {
  const { range } = useDateRange();
  return useQuery({
    queryKey: ["forecasts", "latest", range.fromDate, range.toDate],
    queryFn: () => fetchLatestForecasts(range.fromDate, range.toDate),
    staleTime: 1000 * 60 * 5,
  });
};
