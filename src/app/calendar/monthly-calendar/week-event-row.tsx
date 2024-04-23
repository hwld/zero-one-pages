import { forwardRef } from "react";
import { WeekEvent } from "../type";
import { CalendarEvent } from "./calendar-event";

type Props = {
  week: Date[];
  weekEvents: WeekEvent[];
  eventLimit: number;
  exceededEventCountMap: Map<number, number>;
  isDraggingDate: boolean;
};

export const WeekEventRow = forwardRef<HTMLDivElement, Props>(
  function WeekEventRow(
    { week, weekEvents, eventLimit, exceededEventCountMap, isDraggingDate },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className="pointer-events-none absolute bottom-0 left-0 top-6 mt-2 w-full gap-1"
      >
        {weekEvents.map((event) => {
          return (
            <CalendarEvent
              key={event.id}
              isDraggingDate={isDraggingDate}
              top={event.top}
              startWeekDay={event.startWeekDay}
              range={event.endWeekDay - event.startWeekDay + 1}
            >
              <div className="flex h-full items-center rounded bg-neutral-700 px-1 transition-colors hover:bg-neutral-800">
                {event.title}
              </div>
            </CalendarEvent>
          );
        })}
        {/* 表示上限を超えたイベントの数 */}
        {week.map((date) => {
          const weekDay = date.getDay();
          const count = exceededEventCountMap.get(weekDay);

          if (!count) {
            return null;
          }

          return (
            <CalendarEvent
              key={weekDay}
              isDraggingDate={isDraggingDate}
              top={eventLimit}
              startWeekDay={weekDay}
              range={1}
            >
              <div className="flex h-full w-full items-center rounded px-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-900/10">
                他<span className="mx-1">{count}</span>件
              </div>
            </CalendarEvent>
          );
        })}
      </div>
    );
  },
);
