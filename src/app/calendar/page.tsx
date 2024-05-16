"use client";
import { useMemo } from "react";
import { MonthlyCalendar } from "./_features/monthly-calendar/monthly-calendar";
import "./style.css";
import { WeeklyCalendar } from "./_features/weekly-calendar/weekly-calendar";
import { useEvents } from "./_features/event/use-events";
import { Sidebar } from "./_components/siderbar";
import { Button, IconButton } from "./_components/button";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useAppState } from "./_components/use-app-state";
import { useCalendarCommands } from "./command";
import { Select } from "./_components/select";

export type CalendarType = "month" | "week";
const Page = () => {
  useCalendarCommands();

  const { events } = useEvents();
  const {
    prevCalendarPage,
    nextCalendarPage,
    calendarType,
    setCalendarType,
    viewDate,
    goTodayCalendarPage,
  } = useAppState();

  const handleNavigateNext = () => {
    nextCalendarPage();
  };

  const handleNavigatePrev = () => {
    prevCalendarPage();
  };

  const calendar = useMemo(() => {
    switch (calendarType) {
      case "month": {
        return <MonthlyCalendar yearMonth={viewDate} events={events} />;
      }
      case "week": {
        return <WeeklyCalendar date={viewDate} events={events} />;
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
          <div className="flex items-center gap-2">
            <IconButton icon={TbChevronLeft} onClick={handleNavigatePrev} />
            <div className="flex select-none items-center">
              <div className="mx-1 text-lg tabular-nums">
                {viewDate.getFullYear()}
              </div>
              年
              <div className="mx-1 w-6 text-center text-lg tabular-nums">
                {viewDate.getMonth() + 1}
              </div>
              月
            </div>
            <IconButton icon={TbChevronRight} onClick={handleNavigateNext} />
          </div>
          <div className="flex w-full justify-end gap-2">
            <Select
              items={[
                { value: "week", label: "週", option: "W" },
                { value: "month", label: "月", option: "M" },
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
