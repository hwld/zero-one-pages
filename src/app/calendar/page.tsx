"use client";
import { useMemo } from "react";
import { MonthlyCalendar } from "./_features/monthly-calendar/monthly-calendar";
import "./style.css";
import { DateColCalendar } from "./_features/date-col-calendar/calendar";
import { useEvents } from "./_features/event/use-events";
import { Sidebar } from "./_components/siderbar";
import { Button } from "./_components/button";
import { useAppState } from "./_components/use-app-state";
import { useCalendarCommands } from "./command";
import { Select } from "./_components/select";
import { CalendarViewDate } from "./_components/calendar-view-date";

const Page = () => {
  useCalendarCommands();

  const { events } = useEvents();
  const { calendarType, setCalendarType, viewDate, goTodayCalendarPage } =
    useAppState();

  const calendar = useMemo(() => {
    switch (calendarType) {
      case "month": {
        return <MonthlyCalendar yearMonth={viewDate} events={events} />;
      }
      case "week": {
        return <DateColCalendar cols={7} viewDate={viewDate} events={events} />;
      }
      case "day": {
        return <DateColCalendar cols={1} viewDate={viewDate} events={events} />;
      }
      default: {
        throw new Error(calendarType satisfies never);
      }
    }
  }, [calendarType, events, viewDate]);

  return (
    <div
      className="grid h-[100dvh] w-[100dvw] grid-cols-[250px_1fr] overflow-hidden bg-neutral-50 text-neutral-700"
      style={{ colorScheme: "light" }}
    >
      <Sidebar />
      <div className="grid grid-rows-[60px,1fr] overflow-hidden">
        <div className="flex items-center justify-between px-4">
          <CalendarViewDate />
          <div className="flex w-full justify-end gap-2">
            <Select
              items={[
                { value: "month", label: "月", option: "M" },
                { value: "week", label: "週", option: "W" },
                { value: "day", label: "日", option: "D" },
              ]}
              value={calendarType}
              onSelect={setCalendarType}
            />
            <Button onClick={goTodayCalendarPage}>今日</Button>
          </div>
        </div>
        {calendar}
      </div>
    </div>
  );
};

export default Page;
