import { useEffect, useMemo, useRef, useState } from "react";
import { MONTHLY_EVENT_ROW_SIZE, WEEK_DAY_LABELS } from "../consts";
import {
  getCalendarDates,
  getExceededEventCountByDayOfWeek,
  getWeekEvents,
} from "./utils";
import { Event } from "../mocks/event-store";
import { CalendarDate, MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { WeekEventRow } from "./week-event-row";
import { addMonths, subMonths } from "date-fns";
import { NavigationButton } from "../navigation-button";
import { useMoveEvent } from "./use-move-event";
import { CreateEventFormDialog } from "../create-event-form-dialog";
import { usePrepareCreateEvent } from "./use-prepare-create-event";

type Props = {
  currentDate: Date;
  events: Event[];
};

export const MonthlyCalendar: React.FC<Props> = ({ currentDate, events }) => {
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

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEvent();

  useEffect(() => {
    const openCreateEventDialog = (event: MouseEvent) => {
      if (event.button === 0) {
        prepareCreateEventActions.setDefaultValues();
      }
    };

    document.addEventListener("mouseup", openCreateEventDialog);
    return () => {
      document.removeEventListener("mouseup", openCreateEventDialog);
    };
  }, [prepareCreateEventActions]);

  const { movingEvent, moveEventActions } = useMoveEvent();

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        moveEventActions.move();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [moveEventActions]);

  return (
    <>
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
                      prepareCreateEventState={prepareCreateEventState}
                    />
                  );
                })}
                <WeekEventRow
                  ref={i === 0 ? firstWeekEventRowRef : undefined}
                  week={week}
                  weekEvents={filteredWeekEvents}
                  eventLimit={eventLimit}
                  exceededEventCountMap={exceededEventCountMap}
                  isDraggingForCreate={
                    prepareCreateEventState.dragDateRange !== undefined
                  }
                  prepareCreateEventActions={prepareCreateEventActions}
                  movingEvent={movingEvent}
                  moveEventActions={moveEventActions}
                />
              </div>
            );
          })}
        </div>
      </div>
      <CreateEventFormDialog
        isOpen={prepareCreateEventState.defaultCreateEventValues !== undefined}
        onClose={prepareCreateEventActions.clearState}
        defaultFormValues={prepareCreateEventState.defaultCreateEventValues}
        onChangeEventPeriodPreview={prepareCreateEventActions.setDragDateRange}
      />
    </>
  );
};
