import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
  format,
  addDays,
  subDays,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Event } from "../mocks/event-store";
import { EVENT_MIN_HEIGHT, splitEvent } from "./utils";
import { NavigationButton } from "../navigation-button";
import { DateColumn } from "./date-column";
import { WeeklyCalendarDayHeader } from "./weekly-calendar-header";
import { useMoveEvent } from "./use-move-event";
import { useResizeEvent } from "./use-resize-event";
import { CreateEventFormDialog } from "../create-event-form-dialog";
import { usePrepareCreateEvent } from "./use-prepare-create-event";

export const WEEKLY_CALENDAR_GRID_COLS_CLASS = "grid-cols-[75px,repeat(7,1fr)]";

type Props = {
  currentDate: Date;
  events: Event[];
};

export const WeeklyCalendar: React.FC<Props> = ({ currentDate, events }) => {
  const [date, setDate] = useState(currentDate);
  const { longTermEvents, defaultEvents } = splitEvent(events);

  const week = useMemo(() => {
    const start = startOfDay(startOfWeek(date));
    const end = startOfDay(endOfWeek(date));

    return eachDayOfInterval({ start, end });
  }, [date]);

  const scrollableElementRef = useRef<HTMLDivElement>(null);
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEvent({ scrollableElementRef });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    prepareCreateEventActions.scroll(e.currentTarget.scrollTop);
  };

  const handleNextWeek = () => {
    setDate(addDays(endOfWeek(date), 1));
  };

  const handlePrevWeek = () => {
    setDate(subDays(startOfWeek(date), 1));
  };

  useEffect(() => {
    const openCreateEventDialog = (e: MouseEvent) => {
      if (e.button === 0) {
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
    const moveEvent = (e: MouseEvent) => {
      if (e.button === 0) {
        moveEventActions.move();
      }
    };

    document.addEventListener("mouseup", moveEvent);
    return () => {
      document.removeEventListener("mouseup", moveEvent);
    };
  }, [moveEventActions, movingEvent]);

  const { resizingEvent, resizeEventActions } = useResizeEvent();
  useEffect(() => {
    const endResizeEvent = (e: MouseEvent) => {
      if (e.button === 0) {
        resizeEventActions.resize();
      }
    };

    document.addEventListener("mouseup", endResizeEvent);
    return () => {
      document.removeEventListener("mouseup", endResizeEvent);
    };
  }, [resizeEventActions]);

  return (
    <>
      <div className="flex min-h-0 flex-col gap-2">
        <div className="flex items-center gap-2">
          <NavigationButton dir="prev" onClick={handlePrevWeek} />
          <div className="flex select-none items-center">
            <div className="mx-1 text-lg tabular-nums">
              {date.getFullYear()}
            </div>
            年
            <div className="mx-1 w-6 text-center text-lg tabular-nums">
              {date.getMonth() + 1}
            </div>
            月
          </div>
          <NavigationButton dir="next" onClick={handleNextWeek} />
        </div>

        <div
          className="flex w-full flex-col overflow-auto"
          ref={scrollableElementRef}
          onScroll={handleScroll}
        >
          <WeeklyCalendarDayHeader
            currentDate={currentDate}
            week={week}
            longTermEvents={longTermEvents}
          />

          <div className="grid grid-cols-[75px,repeat(7,1fr)]">
            <div className="mr-2">
              {eachHourOfInterval({
                start: startOfDay(date),
                end: endOfDay(date),
              }).map((h, i) => {
                return (
                  <div
                    className="relative select-none whitespace-nowrap tabular-nums text-neutral-400"
                    key={i}
                    style={{
                      height: EVENT_MIN_HEIGHT * 4,
                      top: i !== 0 ? "-6px" : undefined,
                      fontSize: "12px",
                    }}
                  >
                    {format(h, "hh:mm a")}
                  </div>
                );
              })}
            </div>
            {week.map((date) => {
              return (
                <DateColumn
                  key={`${date}`}
                  currentDate={currentDate}
                  date={date}
                  events={defaultEvents}
                  movingEvent={movingEvent}
                  moveEventActions={moveEventActions}
                  prepareCreateEventState={prepareCreateEventState}
                  prepareCreateEventActions={prepareCreateEventActions}
                  resizingEvent={resizingEvent}
                  resizeEventActions={resizeEventActions}
                />
              );
            })}
          </div>
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
