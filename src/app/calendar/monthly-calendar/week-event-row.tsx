import { forwardRef, useRef } from "react";
import { WeekEvent } from "../type";
import { MoreWeekEventsCard, WeekEventCard } from "./week-event-card";
import { MONTHLY_EVENT_ROW_SIZE } from "../consts";
import { MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { DragDateRange } from "../utils";
import { useMergedRef } from "@mantine/hooks";

type Props = {
  week: Date[];
  weekEvents: WeekEvent[];
  eventLimit: number;
  exceededEventCountMap: Map<number, number>;
  isDraggingDate: boolean;
  dragDateRange: DragDateRange | undefined;
  onDragDateRangeChange: (range: DragDateRange | undefined) => void;
};

export const WeekEventRow = forwardRef<HTMLDivElement, Props>(
  function WeekEventRow(
    {
      week,
      weekEvents,
      eventLimit,
      exceededEventCountMap,
      isDraggingDate,
      dragDateRange,
      onDragDateRangeChange,
    },
    _ref,
  ) {
    const rowRef = useRef<HTMLDivElement>(null);
    const ref = useMergedRef(_ref, rowRef);

    const getDateFromX = (x: number) => {
      if (!rowRef.current) {
        throw new Error("");
      }

      const rowRect = rowRef.current.getBoundingClientRect();
      const weekDay = Math.floor((x - rowRect.x) / (rowRect.width / 7));

      return week[weekDay];
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      const date = getDateFromX(event.clientX);
      onDragDateRangeChange({ dragStartDate: date, dragEndDate: date });
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!dragDateRange) {
        return;
      }

      const date = getDateFromX(event.clientX);
      onDragDateRangeChange({ ...dragDateRange, dragEndDate: date });
    };

    return (
      <div
        ref={ref}
        className="absolute bottom-0 left-0 top-0 w-full gap-1"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {weekEvents.map((event) => {
          return (
            <WeekEventCard
              key={event.id}
              topMargin={MONTHLY_DATE_HEADER_HEIGHT}
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
