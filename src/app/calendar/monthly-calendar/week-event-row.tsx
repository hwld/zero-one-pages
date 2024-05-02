import { forwardRef } from "react";
import { WeekEvent } from "../type";
import { MoreWeekEventsCard, WeekEventCard } from "./week-event-card";
import { MONTHLY_EVENT_ROW_SIZE } from "../consts";

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
            <WeekEventCard
              key={event.id}
              height={MONTHLY_EVENT_ROW_SIZE}
              disablePointerEvents={isDraggingDate}
              weekEvent={event}
            />
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
            <MoreWeekEventsCard
              key={weekDay}
              weekDay={weekDay}
              count={count}
              limit={eventLimit}
              disablePointerEvents={isDraggingDate}
              height={MONTHLY_EVENT_ROW_SIZE}
            />
          );
        })}
      </div>
    );
  },
);
