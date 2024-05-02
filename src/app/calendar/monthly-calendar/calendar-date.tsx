import { isSameMonth, isSameYear, isSaturday, isWeekend } from "date-fns";
import { DragDateRange, isWithinDragDateRange } from "../utils";
import clsx from "clsx";
import { MouseEvent } from "react";

type Props = {
  calendarYearMonth: Date;
  date: Date;
  isLastWeek: boolean;
  dragDateRange: DragDateRange | undefined;
  onDragDateRangeChange: (range: DragDateRange | undefined) => void;
};

export const CalendarDate: React.FC<Props> = ({
  calendarYearMonth,
  date,
  isLastWeek,
  dragDateRange,
  onDragDateRangeChange,
}) => {
  const isDragging = !!dragDateRange;

  const handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      onDragDateRangeChange({ dragStartDate: date, dragEndDate: date });
    }
  };

  const handleMouseEnter = () => {
    if (isDragging) {
      onDragDateRangeChange({ ...dragDateRange, dragEndDate: date });
    }
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
      onMouseEnter={handleMouseEnter}
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
