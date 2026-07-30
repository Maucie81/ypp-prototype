"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DateFilterValue } from "@/components/filters/DateFilter";
import type { DateRangePreset } from "@/lib/mockData";

export type TimeRangePreset = DateRangePreset;

function presetFromValue(value: DateFilterValue): DateRangePreset {
  if (value.mode === "preset") return value.preset as DateRangePreset;
  return "last7";
}

type TimeFilterContextValue = {
  dateValue: DateFilterValue;
  setDateValue: (next: DateFilterValue) => void;
  range: TimeRangePreset;
};

const TimeFilterContext = createContext<TimeFilterContextValue | null>(null);

const defaultDateValue: DateFilterValue = {
  mode: "preset",
  preset: "last7",
};

export function TimeFilterProvider({ children }: { children: ReactNode }) {
  const [dateValue, setDateValue] = useState<DateFilterValue>(defaultDateValue);
  const range = useMemo(
    () => presetFromValue(dateValue),
    [dateValue]
  );
  const value = useMemo<TimeFilterContextValue>(
    () => ({
      dateValue,
      setDateValue,
      range,
    }),
    [dateValue, range]
  );
  return (
    <TimeFilterContext.Provider value={value}>
      <div className="flex min-h-0 flex-1 flex-col h-full">
        <div className="flex min-h-0 flex-1 flex-col">
          {children}
        </div>
      </div>
    </TimeFilterContext.Provider>
  );
}

export function useTimeFilter(): TimeFilterContextValue {
  const ctx = useContext(TimeFilterContext);
  if (!ctx) {
    return {
      dateValue: defaultDateValue,
      setDateValue: () => {},
      range: "last7",
    };
  }
  return ctx;
}
