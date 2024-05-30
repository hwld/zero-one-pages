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
    switch (calendarInfo.type.kind) {
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
            cols={calendarInfo.type.days}
            viewDate={calendarInfo.selectedDate}
            events={events}
          />
        );
      }
      default: {
        throw new Error(calendarInfo.type satisfies never);
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
        <div className="flex items-center gap-2 px-4">
          <CalendarViewDate />
          <Select
            items={[
              { type: "root", value: "month", label: "月", shortcut: "M" },
              { type: "root", value: "week", label: "週", shortcut: "W" },
              { type: "root", value: "day", label: "日", shortcut: "D" },
              {
                type: "nest",
                label: "日数",
                items: [
                  { type: "root", value: "2days", label: "2日間" },
                  { type: "root", value: "3days", label: "3日間" },
                  { type: "root", value: "4days", label: "4日間" },
                ],
              },
            ]}
            // TODO: なんとかしたい・・・
            selectedValue={useMemo(() => {
              if (calendarInfo.type.kind === "month") {
                return "month";
              } else if (calendarInfo.type.days === DAILY_CALENDAR_TYPE.days) {
                return "day";
              } else if (calendarInfo.type.days === WEEKLY_CALENDAR_TYPE.days) {
                return "week";
              } else if (calendarInfo.type.days === 2) {
                return "2days";
              } else if (calendarInfo.type.days === 3) {
                return "3days";
              } else if (calendarInfo.type.days === 4) {
                return "4days";
              }
              throw new Error("対応していない日数");
            }, [calendarInfo])}
            onSelect={(value) => {
              switch (value) {
                case "month": {
                  changeCalendarType({ kind: "month" });
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
                case "2days": {
                  changeCalendarType({ kind: "range", days: 2 });
                  return;
                }
                case "3days": {
                  changeCalendarType({ kind: "range", days: 3 });
                  return;
                }
                case "4days": {
                  changeCalendarType({ kind: "range", days: 4 });
                  return;
                }
                default: {
                  throw new Error(value satisfies never);
                }
              }
            }}
          />
          <Button onClick={goTodayCalendarPage}>今日</Button>
        </div>
        {calendar}
      </div>
    </div>
  );
};

export default Page;
