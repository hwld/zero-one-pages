import { useEffect, useMemo, useRef, useState } from "react";
import { MONTHLY_EVENT_ROW_SIZE, WEEK_DAY_LABELS } from "../../consts";
import { getExceededEventCountByDayOfWeek } from "../event/week-event/utils";
import { getCalendarDates } from "../utils";
import { getWeekEvents } from "../event/week-event/utils";
import { Event } from "../../_mocks/event-store";
import { CalendarDate, MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { WeekEventRow } from "../event/week-event/week-event-row";
import { MoveEventProvider, useMoveEvent } from "./move-event-provider";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import {
  PrepareCreateEventProvider,
  usePrepareCreateEvent,
} from "./prepare-create-event-provider";
import { getEventFromDraggingEvent } from "../utils";

type Props = {
  currentDate: Date;
  yearMonth: Date;
  events: Event[];
};

export const MonthlyCalendarImpl: React.FC<Props> = ({
  currentDate,
  yearMonth,
  events,
}) => {
  const year = useMemo(() => {
    return yearMonth.getFullYear();
  }, [yearMonth]);

  const month = useMemo(() => {
    return yearMonth.getMonth() + 1;
  }, [yearMonth]);

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

  const { isEventMoving, moveEventPreview } = useMoveEvent();
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEvent();

  return (
    <>
      <div className="grid h-full w-full grid-rows-[min-content,1fr] gap-2">
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
            const weekEvents = getWeekEvents({
              week,
              events: events.map((event): Event => {
                if (!isEventMoving && moveEventPreview?.event.id === event.id) {
                  return getEventFromDraggingEvent(moveEventPreview);
                }

                return event;
              }),
            });

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

export const MonthlyCalendar: React.FC<Props> = (props) => {
  return (
    <PrepareCreateEventProvider>
      <MoveEventProvider>
        <MonthlyCalendarImpl {...props} />
      </MoveEventProvider>
    </PrepareCreateEventProvider>
  );
};
