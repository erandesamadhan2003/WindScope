import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { ForecastPage } from "@/pages/ForecastPage";
import { AccuracyPage } from "@/pages/AccuracyPage";
import { DateRangeProvider } from "@/context/DateRangeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DateRangeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="forecast" element={<ForecastPage />} />
              <Route path="accuracy" element={<AccuracyPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DateRangeProvider>
    </QueryClientProvider>
  );
}