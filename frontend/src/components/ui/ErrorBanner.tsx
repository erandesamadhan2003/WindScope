import { AlertTriangle } from "lucide-react";

interface Props {
  message?: string;
}

export const ErrorBanner = ({ message = "Failed to load data." }: Props) => (
  <div className="flex items-center gap-3 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
    <AlertTriangle size={16} className="shrink-0" />
    <span>{message}</span>
  </div>
);
