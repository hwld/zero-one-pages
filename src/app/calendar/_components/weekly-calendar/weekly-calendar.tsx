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
import { useMemo, useRef, useState } from "react";
import { Event } from "../../_mocks/event-store";
import { EVENT_MIN_HEIGHT, splitEvent } from "./utils";
import { NavigationButton } from "../navigation-button";
import { DateColumn } from "./date-column";
import { WeeklyCalendarDayHeader } from "./weekly-calendar-header";
import { useMoveEventEffect } from "./use-move-event-effect";
import { useResizeEventEffect } from "./use-resize-event-effect";
import { CreateEventFormDialog } from "../create-event-form-dialog";
import { usePrepareCreateEventEffect } from "./use-prepare-create-event-effect";

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

  const scrollableRef = useRef<HTMLDivElement>(null);

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEventEffect({ scrollableRef });
  const { movingEvent, moveEventActions } = useMoveEventEffect({
    scrollableRef,
  });
  const { isEventResizing, resizingEvent, resizeEventActions } =
    useResizeEventEffect({
      scrollableRef,
    });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;

    if (prepareCreateEventState) {
      prepareCreateEventActions.scroll(scrollTop);
    }

    if (movingEvent) {
      moveEventActions.scroll(scrollTop);
    }

    if (resizingEvent) {
      resizeEventActions.scroll(scrollTop);
    }
  };

  const handleNextWeek = () => {
    setDate(addDays(endOfWeek(date), 1));
  };

  const handlePrevWeek = () => {
    setDate(subDays(startOfWeek(date), 1));
  };

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
          ref={scrollableRef}
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
                  isEventResizing={isEventResizing}
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
