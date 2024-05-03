import { useEffect, useMemo, useRef, useState } from "react";
import { MONTHLY_EVENT_ROW_SIZE, WEEK_DAY_LABELS } from "../consts";
import {
  getCalendarDates,
  getExceededEventCountByDayOfWeek,
  getWeekEvents,
} from "./utils";
import { DragDateRange, DragEvent } from "../utils";
import { Event } from "../type";
import { CalendarDate, MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { WeekEventRow } from "./week-event-row";
import {
  addDays,
  addMonths,
  differenceInDays,
  max,
  min,
  subMonths,
} from "date-fns";
import { NavigationButton } from "../navigation-button";

type Props = {
  currentDate: Date;
  events: Event[];
  onCreateEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
};

export const MonthlyCalendar: React.FC<Props> = ({
  currentDate,
  events,
  onCreateEvent,
  onUpdateEvent,
}) => {
  const [yearMonth, setYearMonth] = useState(currentDate);

  const year = useMemo(() => {
    return yearMonth.getFullYear();
  }, [yearMonth]);

  const month = useMemo(() => {
    return yearMonth.getMonth() + 1;
  }, [yearMonth]);

  const handleGoPrevMonth = () => {
    setYearMonth(subMonths(yearMonth, 1));
  };
  const handleGoNextMonth = () => {
    setYearMonth(addMonths(yearMonth, 1));
  };

  const calendar = useMemo(() => {
    return getCalendarDates({ year, month });
  }, [month, year]);

  // イベント作成のためのDrag
  const [dragDateRange, setDragDateRange] = useState<DragDateRange | undefined>(
    undefined,
  );

  // イベント移動のためのDrag
  const [dragEvent, setDragEvent] = useState<DragEvent | undefined>(undefined);

  const firstWeekEventRowRef = useRef<HTMLDivElement>(null);
  const [eventLimit, setEventLimit] = useState(0);

  useEffect(() => {
    const eventSpace = firstWeekEventRowRef.current;
    const measure = () => {
      if (!eventSpace) {
        return;
      }
      const eventSpaceHeight =
        eventSpace.getBoundingClientRect().height - MONTHLY_DATE_HEADER_HEIGHT;
      // read moreを表示するため、-1する
      const eventLimit =
        Math.floor(eventSpaceHeight / MONTHLY_EVENT_ROW_SIZE) - 1;
      setEventLimit(eventLimit);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("reset", measure);
    };
  }, [yearMonth]);

  useEffect(() => {
    const createEvent = (event: MouseEvent) => {
      if (!dragDateRange || event.button !== 0) {
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
      setDragDateRange(undefined);
    };

    document.addEventListener("mouseup", createEvent);
    return () => {
      document.removeEventListener("mouseup", createEvent);
    };
  }, [dragDateRange, onCreateEvent]);

  useEffect(() => {
    const moveEvent = (e: MouseEvent) => {
      if (!dragEvent || e.button !== 0) {
        return;
      }

      const { dragStartDate, dragEndDate } = dragEvent;
      const diffDay = differenceInDays(dragEndDate, dragStartDate);

      const event = dragEvent.event;
      const newStart = addDays(event.start, diffDay);
      const newEnd = addDays(event.end, diffDay);

      onUpdateEvent({ ...dragEvent.event, start: newStart, end: newEnd });
      setDragEvent(undefined);
    };

    document.addEventListener("mouseup", moveEvent);
    return () => {
      document.removeEventListener("mouseup", moveEvent);
    };
  }, [dragEvent, onUpdateEvent]);

  return (
    <div className="grid h-full w-full grid-rows-[min-content,min-content,1fr] gap-2">
      <div className="flex items-center gap-2">
        <NavigationButton dir="prev" onClick={handleGoPrevMonth} />
        <div className="flex select-none items-center">
          <div className="mx-1 text-lg tabular-nums">{year}</div>年
          <div className="mx-1 w-6 text-center text-lg tabular-nums">
            {month}
          </div>
          月
        </div>
        <NavigationButton dir="next" onClick={handleGoNextMonth} />
      </div>
      <div className="grid w-full grid-cols-7">
        {WEEK_DAY_LABELS.map((weekDay) => {
          return (
            <div className="text-center text-xs" key={weekDay}>
              {weekDay}
            </div>
          );
        })}
      </div>
      <div className="grid">
        {calendar.map((week, i) => {
          const weekEvents = getWeekEvents({ week, events });

          const filteredWeekEvents = weekEvents.filter(
            (event) => event.top < eventLimit,
          );
          const exceededEventCountMap = getExceededEventCountByDayOfWeek({
            week,
            weekEvents,
            limit: eventLimit,
          });

          return (
            <div
              key={`${week[0]}`}
              className="relative grid min-h-[80px] min-w-[560px] select-none grid-cols-7"
            >
              {week.map((date) => {
                return (
                  <CalendarDate
                    currentDate={currentDate}
                    calendarYearMonth={yearMonth}
                    key={date.getTime()}
                    date={date}
                    isLastWeek={calendar.length - 1 === i}
                    dragDateRange={dragDateRange}
                  />
                );
              })}
              <WeekEventRow
                ref={i === 0 ? firstWeekEventRowRef : undefined}
                week={week}
                weekEvents={filteredWeekEvents}
                eventLimit={eventLimit}
                exceededEventCountMap={exceededEventCountMap}
                dragDateRange={dragDateRange}
                onDragDateRangeChange={setDragDateRange}
                dragEvent={dragEvent}
                onChangeDragEvent={setDragEvent}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
