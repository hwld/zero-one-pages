"use client";
import { useMemo, useState } from "react";
import { MonthlyCalendar } from "./_components/monthly-calendar/monthly-calendar";
import "./style.css";
import { WeeklyCalendar } from "./_components/weekly-calendar/weekly-calendar";
import { useMinuteClock } from "./_components/use-minute-clock";
import { useEvents } from "./_queries/use-events";
import { NavigationButton } from "./_components/navigation-button";
import {
  addDays,
  endOfWeek,
  subDays,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";

type CalendarType = "month" | "week";
const Page = () => {
  const { events } = useEvents();
  const [type, setType] = useState<CalendarType>("week");
  const currentDate = useMinuteClock();
  const [date, setDate] = useState(currentDate);

  const calendar = useMemo(() => {
    switch (type) {
      case "month": {
        return (
          <MonthlyCalendar
            currentDate={currentDate}
            yearMonth={date}
            events={events}
          />
        );
      }
      case "week": {
        return (
          <WeeklyCalendar
            currentDate={currentDate}
            date={date}
            events={events}
          />
        );
      }
      default: {
        throw new Error(type satisfies never);
      }
    }
  }, [currentDate, date, events, type]);

  const handleNavigateNext = () => {
    switch (type) {
      case "week": {
        setDate(addDays(endOfWeek(date), 1));
        return;
      }
      case "month": {
        setDate(addMonths(date, 1));
        return;
      }
      default: {
        throw new Error(type satisfies never);
      }
    }
  };

  const handleNavigatePrev = () => {
    switch (type) {
      case "week": {
        setDate(subDays(startOfWeek(date), 1));
        return;
      }
      case "month": {
        setDate(subMonths(date, 1));
        return;
      }
      default: {
        throw new Error(type satisfies never);
      }
    }
  };

  return (
    <div
      className="grid h-[100dvh] w-[100dvw] grid-cols-[250px,1fr] overflow-hidden bg-neutral-50 text-neutral-700"
      style={{ colorScheme: "light" }}
    >
      <div className="border-r border-neutral-300 bg-neutral-100"></div>
      <div className="grid grid-rows-[60px,1fr] overflow-hidden">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <NavigationButton dir="prev" onClick={handleNavigatePrev} />
            <div className="flex select-none items-center">
              <div className="mx-1 text-lg tabular-nums">
                {date.getFullYear()}
              </div>
              年
              <div className="mx-1 w-6 text-center text-lg tabular-nums">
                {date.getMonth() + 1}
              </div>
              月
            </div>
            <NavigationButton dir="next" onClick={handleNavigateNext} />
          </div>
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
        </div>
        {calendar}
      </div>
    </div>
  );
};

export default Page;
