"use client";
import { useMemo } from "react";
import { MonthlyCalendar } from "./_features/monthly-calendar/monthly-calendar";
import "./style.css";
import { DateColCalendar } from "./_features/date-col-calendar/calendar";
import { useEvents } from "./_features/event/use-events";
import { Sidebar } from "./_components/siderbar";
import { Button } from "./_components/button";
import {
  DAILY_CALENDAR_TYPE,
  WEEKLY_CALENDAR_TYPE,
  useAppState,
} from "./_components/use-app-state";
import { useCalendarCommands } from "./command";
import { Select } from "./_components/select";
import { CalendarViewDate } from "./_components/calendar-view-date";

const Page = () => {
  useCalendarCommands();

  const { events } = useEvents();
  const { calendarInfo, goTodayCalendarPage, changeCalendarType } =
    useAppState();

  const calendar = useMemo(() => {
    switch (calendarInfo.type) {
      case "month": {
        return (
          <MonthlyCalendar
            yearMonth={calendarInfo.selectedDate}
            events={events}
          />
        );
      }
      case "range": {
        return (
          <DateColCalendar
            cols={calendarInfo.days}
            viewDate={calendarInfo.selectedDate}
            events={events}
          />
        );
      }
      default: {
        throw new Error(calendarInfo satisfies never);
      }
    }
  }, [calendarInfo, events]);

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
              value={useMemo(() => {
                if (calendarInfo.type === "month") {
                  return "month";
                } else if (calendarInfo.days === DAILY_CALENDAR_TYPE.days) {
                  return "day";
                } else if (calendarInfo.days === WEEKLY_CALENDAR_TYPE.days) {
                  return "week";
                }
                throw new Error("TODO:");
              }, [calendarInfo])}
              onSelect={(item) => {
                switch (item) {
                  case "month": {
                    changeCalendarType({ type: "month" });
                    return;
                  }
                  case "week": {
                    changeCalendarType(WEEKLY_CALENDAR_TYPE);
                    return;
                  }
                  case "day": {
                    changeCalendarType(DAILY_CALENDAR_TYPE);
                    return;
                  }
                }
              }}
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
