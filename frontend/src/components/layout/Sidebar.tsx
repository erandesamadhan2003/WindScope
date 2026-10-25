import { NavLink } from "react-router-dom";
import { LayoutDashboard, LineChart, BarChart3, Wind } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/forecast", label: "Forecast View", icon: LineChart },
  { to: "/accuracy", label: "Accuracy", icon: BarChart3 },
];

export const Sidebar = () => (
  <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-navy-700 bg-navy-900">
    {/* Logo */}
    <div className="flex items-center gap-2.5 border-b border-navy-700 px-5 py-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-wind-600">
        <Wind size={16} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-100">WindView</p>
        <p className="text-xs text-slate-500">UK Day-Ahead</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4">
      <p className="mb-2 px-2 text-xs font-medium uppercase tracking-widest text-slate-600">
        Analysis
      </p>
      <ul className="space-y-0.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-wind-600/20 text-wind-400"
                    : "text-slate-400 hover:bg-navy-800 hover:text-slate-200",
                )
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    {/* Footer */}
    <div className="border-t border-navy-700 px-5 py-4">
      <p className="text-xs text-slate-600">Data: Elexon BMRS</p>
      <p className="font-mono text-xs text-slate-700">Live stream</p>
    </div>
  </aside>
);
