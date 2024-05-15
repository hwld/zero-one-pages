import { MONTHLY_EVENT_ROW_SIZE } from "../../consts";
import { WeekEventRow } from "../event/week-event/week-event-row";
import { CalendarDate, MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { useOptimisticWeekEvents } from "../event/week-event/use-optimistic-week-events";
import { Event } from "../../_mocks/event-store";
import { RefObject } from "react";

type Props = {
  week: Date[];
  events: Event[];
  rowRef?: RefObject<HTMLDivElement>;
  currentDate: Date;
  calendarYearMonth: Date;
  eventLimit: number;
};

export const WeekRow: React.FC<Props> = ({
  week,
  events,
  rowRef,
  currentDate,
  calendarYearMonth,
  eventLimit,
}) => {
  const weekEvents = useOptimisticWeekEvents({ week, events });

  return (
    <div className="relative grid min-h-[80px] min-w-[560px] select-none grid-cols-7">
      {week.map((date) => {
        return (
          <CalendarDate
            currentDate={currentDate}
            calendarYearMonth={calendarYearMonth}
            key={date.getTime()}
            date={date}
          />
        );
      })}
      <div className="absolute inset-0">
        <WeekEventRow
          ref={rowRef}
          week={week}
          allWeekEvents={weekEvents}
          eventLimit={eventLimit}
          eventHeight={MONTHLY_EVENT_ROW_SIZE}
          eventTop={MONTHLY_DATE_HEADER_HEIGHT}
        />
      </div>
    </div>
  );
};
