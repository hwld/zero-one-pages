import {
  isSameDay,
  isSameMonth,
  isSameYear,
  isSaturday,
  isWeekend,
} from "date-fns";
import { isDayWithinDragDateRange } from "../utils";
import clsx from "clsx";
import { PrepareCreateEventState } from "./prepare-create-event-provider";

export const MONTHLY_DATE_HEADER_HEIGHT = 32;

type Props = {
  currentDate: Date;
  calendarYearMonth: Date;
  date: Date;
  isLastWeek: boolean;
  prepareCreateEventState: PrepareCreateEventState;
};

export const CalendarDate: React.FC<Props> = ({
  currentDate,
  calendarYearMonth,
  date,
  isLastWeek,
  prepareCreateEventState,
}) => {
  const isSameCalendarYearMonth =
    isSameMonth(calendarYearMonth, date) && isSameYear(calendarYearMonth, date);

  const isDraggedDate =
    prepareCreateEventState.dragDateRange &&
    isDayWithinDragDateRange(date, prepareCreateEventState.dragDateRange);

  return (
    <div
      className={clsx(
        "relative select-none border-l border-t border-neutral-300 text-xs text-neutral-700 transition-colors",
        isSaturday(date) && "border-r",
        isLastWeek && "border-b",
        isWeekend(date) ? "bg-neutral-200/25" : "",
      )}
    >
      <div
        className={clsx(
          "h-full w-full",
          isDraggedDate ? "bg-neutral-500/15" : "",
        )}
      >
        <div
          className="h-10 w-full p-1"
          style={{ height: MONTHLY_DATE_HEADER_HEIGHT }}
        >
          <div
            className={clsx(
              "grid place-items-center rounded p-1",
              isSameCalendarYearMonth ? "opacity-100" : "opacity-50",
              isSameDay(currentDate, date) && "bg-blue-500 text-neutral-100",
            )}
            style={{
              width: MONTHLY_DATE_HEADER_HEIGHT - 8,
              height: MONTHLY_DATE_HEADER_HEIGHT - 8,
            }}
          >
            {date.getDate()}
          </div>
        </div>
      </div>
    </div>
  );
};
