import { useQuery } from "@tanstack/react-query";
import { fetchAccuracy } from "@/api/accuracy";
import { useDateRange } from "@/context/DateRangeContext";

export const useAccuracy = () => {
  const { range } = useDateRange();
  return useQuery({
    queryKey: ["accuracy", range.fromDate, range.toDate],
    queryFn: () => fetchAccuracy(range.fromDate, range.toDate),
    staleTime: 1000 * 60 * 5,
  });
};
