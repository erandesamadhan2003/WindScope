import { useQuery } from "@tanstack/react-query";
import { fetchActuals } from "@/api/actuals";
import { useDateRange } from "@/context/DateRangeContext";

export const useActuals = () => {
  const { range } = useDateRange();
  return useQuery({
    queryKey: ["actuals", range.fromDate, range.toDate],
    queryFn: () => fetchActuals(range.fromDate, range.toDate),
    staleTime: 1000 * 60 * 5, // 5 min — live data changes
  });
};
