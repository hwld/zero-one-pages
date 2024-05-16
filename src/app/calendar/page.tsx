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

export type CalendarType = "month" | "week";
const Page = () => {
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
            <select
              className="h-8 w-[80px] rounded border border-neutral-300 bg-neutral-100 px-2 text-sm transition-colors hover:bg-neutral-200"
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value as CalendarType)}
            >
              <option value="month">月</option>
              <option value="week">週</option>
            </select>
            <Button onClick={goTodayCalendarPage}>今日</Button>
          </div>
        </div>
        {calendar}
      </div>
    </div>
  );
};

export default Page;
