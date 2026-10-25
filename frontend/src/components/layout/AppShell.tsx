import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DateRangePicker } from "./DateRangePicker";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/forecast": "Forecast View",
  "/accuracy": "Accuracy Analysis",
};

export const AppShell = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "WindView";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-navy-700 bg-navy-900 px-8 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
              {title}
            </span>
          </div>
          <DateRangePicker />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};