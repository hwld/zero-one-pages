import { useEffect, useMemo, useRef, useState } from "react";
import { EVENT_ROW_SIZE } from "../consts";
import {
  DragDateRange,
  getCalendarDates,
  getExceededEventCountByDayOfWeek,
  getWeekEvents,
} from "../utils";
import { Event } from "../type";
import { CalendarDate } from "./calendar-date";
import { WeekEventRow } from "./week-event-row";

export const MonthlyCalendar: React.FC = () => {
  const year = 2024;
  const month = 4;

  const calendar = useMemo(() => {
    return getCalendarDates({ year, month });
  }, []);

  const [events, setEvents] = useState<Event[]>([]);

  const [dragDateRange, setDragDateRange] = useState<DragDateRange | undefined>(
    undefined,
  );

  const handleCreateEvent = (event: Event) => {
    setEvents((ss) => [...ss, event]);
  };

  const firstWeekEventRowRef = useRef<HTMLDivElement>(null);
  const [eventLimit, setEventLimit] = useState(0);

  useEffect(() => {
    const eventSpace = firstWeekEventRowRef.current;
    const measure = () => {
      if (!eventSpace) {
        return;
      }
      const eventSpaceHeight = eventSpace.getBoundingClientRect().height;
      // read moreを表示するため、-1する
      const eventLimit = Math.floor(eventSpaceHeight / EVENT_ROW_SIZE) - 1;
      setEventLimit(eventLimit);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("reset", measure);
    };
  }, []);

  return (
    <div className="grid h-full w-full flex-col [&>div:last-child]:border-b">
      {calendar.map((week, i) => {
        const weekEvents = getWeekEvents({ week, events });

        const filteredWeekEvents = weekEvents.filter(
          (event) => event.top < eventLimit,
        );
        const exceededEventCountMap = getExceededEventCountByDayOfWeek({
          weekEvents,
          limit: eventLimit,
        });

        return (
          <div
            key={`${week[0]}`}
            className="relative grid min-h-[80px] min-w-[560px] select-none grid-cols-7 [&>div:last-child]:border-r"
          >
            {week.map((date) => {
              return (
                <CalendarDate
                  key={date.getTime()}
                  date={date}
                  dragDateRange={dragDateRange}
                  onDragDateRangeChange={setDragDateRange}
                  onCreateEvent={handleCreateEvent}
                />
              );
            })}
            <WeekEventRow
              ref={i === 0 ? firstWeekEventRowRef : undefined}
              isDraggingDate={!!dragDateRange}
              week={week}
              weekEvents={filteredWeekEvents}
              eventLimit={eventLimit}
              exceededEventCountMap={exceededEventCountMap}
            />
          </div>
        );
      })}
    </div>
  );
};
