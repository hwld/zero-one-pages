"use client";
import { useMemo, useState } from "react";
import { MonthlyCalendar } from "./monthly-calendar/monthly-calendar";
import "./style.css";
import { WeeklyCalendar } from "./weekly-calendar/weekly-calendar";

type CalendarType = "month" | "week";
const Page = () => {
  const [type, setType] = useState<CalendarType>("week");

  const calendar = useMemo(() => {
    switch (type) {
      case "month": {
        return <MonthlyCalendar />;
      }
      case "week": {
        return <WeeklyCalendar />;
      }
      default: {
        throw new Error(type satisfies never);
      }
    }
  }, [type]);

  return (
    <div className="grid h-[100dvh] w-[100dvw] grid-rows-[min-content,1fr] gap-4 overflow-hidden bg-neutral-100 p-4 text-neutral-700">
      <div className="text-end">
        <select
          className="h-8 w-[100px] rounded border border-neutral-300 bg-neutral-100 px-2"
          value={type}
          onChange={(e) => setType(e.target.value as CalendarType)}
        >
          <option value="month">月</option>
          <option value="week">週</option>
        </select>
      </div>
      {calendar}
    </div>
  );
};

export default Page;
