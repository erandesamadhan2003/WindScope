import { createContext, useContext, useState, ReactNode } from "react";

// Default: yesterday → tomorrow (3-day window, what the live API actually covers)
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const fmt = (d: Date) => d.toISOString().slice(0, 10);

interface DateRange {
  fromDate: string;
  toDate: string;
}

interface DateRangeContextType {
  range: DateRange;
  setRange: (r: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | null>(null);

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
  const [range, setRange] = useState<DateRange>({
    fromDate: fmt(yesterday),
    toDate: fmt(tomorrow),
  });

  return (
    <DateRangeContext.Provider value={{ range, setRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be inside DateRangeProvider");
  return ctx;
};