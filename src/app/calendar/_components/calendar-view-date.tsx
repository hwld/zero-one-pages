import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { IconButton } from "./button";
import { useAppState } from "./use-app-state";
import { useMemo } from "react";

export const CalendarViewDate: React.FC = () => {
  const { viewDate, prevCalendarPage, nextCalendarPage, calendarType } =
    useAppState();

  const option = useMemo(() => {
    switch (calendarType) {
      case "month": {
        return null;
      }
      case "week": {
        return null;
      }
      case "day": {
        return (
          <>
            <div className="mx-1 w-6 text-center text-lg tabular-nums">
              {viewDate.getDate()}
            </div>
            日
          </>
        );
      }
      default: {
        throw new Error(calendarType satisfies never);
      }
    }
  }, [calendarType, viewDate]);

  return (
    <div className="flex items-center gap-2">
      <IconButton icon={TbChevronLeft} onClick={prevCalendarPage} />
      <div className="flex select-none items-center">
        <div className="mx-1 text-lg tabular-nums">
          {viewDate.getFullYear()}
        </div>
        年
        <div className="mx-1 w-6 text-center text-lg tabular-nums">
          {viewDate.getMonth() + 1}
        </div>
        月{option}
      </div>
      <IconButton icon={TbChevronRight} onClick={nextCalendarPage} />
    </div>
  );
};
