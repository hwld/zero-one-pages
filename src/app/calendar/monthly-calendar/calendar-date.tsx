import {
  isSameMonth,
  isSameYear,
  isSaturday,
  isWeekend,
  max,
  min,
} from "date-fns";
import { DragDateRange, isWithinDragDateRange } from "../utils";
import { Event } from "../type";
import clsx from "clsx";
import { MouseEvent } from "react";

type Props = {
  calendarYearMonth: Date;
  date: Date;
  isLastWeek: boolean;
  dragDateRange: DragDateRange | undefined;
  onDragDateRangeChange: (range: DragDateRange | undefined) => void;
  onCreateEvent: (event: Event) => void;
};

export const CalendarDate: React.FC<Props> = ({
  calendarYearMonth,
  date,
  isLastWeek,
  dragDateRange,
  onDragDateRangeChange,
  onCreateEvent,
}) => {
  const isDragging = !!dragDateRange;

  const handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      onDragDateRangeChange({ dragStartDate: date, dragEndDate: date });
    }
  };

  const handleMouseOver = () => {
    if (isDragging) {
      onDragDateRangeChange({ ...dragDateRange, dragEndDate: date });
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!isDragging || event.button !== 0) {
      return;
    }

    const eventStart = min([
      dragDateRange.dragStartDate,
      dragDateRange.dragEndDate,
    ]);

    const eventEnd = max([
      dragDateRange.dragStartDate,
      dragDateRange.dragEndDate,
    ]);

    onCreateEvent({
      id: crypto.randomUUID(),
      allDay: true,
      title: "event",
      start: eventStart,
      end: eventEnd,
    });
    onDragDateRangeChange(undefined);
  };

  const isSameCalendarYearMonth =
    isSameMonth(calendarYearMonth, date) && isSameYear(calendarYearMonth, date);

  return (
    <div
      className={clsx(
        "relative select-none border-l border-t border-neutral-300 text-xs transition-colors",
        isSaturday(date) && "border-r",
        isLastWeek && "border-b",
        isSameCalendarYearMonth ? "text-neutral-700" : "text-neutral-400",
        isWeekend(date) ? "bg-neutral-200/25" : "",
      )}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseUp={handleMouseUp}
    >
      <div
        className={clsx(
          "h-full w-full",
          dragDateRange && isWithinDragDateRange(date, dragDateRange)
            ? "bg-neutral-500/15"
            : "",
        )}
      >
        <div className="w-full p-2">{date.getDate()}</div>
      </div>
    </div>
  );
};
