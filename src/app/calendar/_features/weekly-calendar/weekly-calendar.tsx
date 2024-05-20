import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
  format,
  differenceInMinutes,
} from "date-fns";
import { RefObject, useMemo, useRef } from "react";
import { Event } from "../../_mocks/event-store";
import { splitEvent } from "./utils";
import {
  DATE_EVENT_MIN_HEIGHT,
  DATE_EVENT_MIN_MINUTES,
} from "../event-in-col/utils";
import { DateColumn } from "./date-column";
import { WeeklyCalendarDayHeader } from "./weekly-calendar-header";
import {
  MoveEventInColProvider,
  useMoveEventInCol,
} from "../event-in-col/move-event-provider";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import {
  PrepareCreateEventInColProvider,
  usePrepareCreateEventInCol,
} from "../event-in-col/prepare-create-event-provider";
import {
  ResizeEventInColProvider,
  useResizeEventInCol,
} from "../event-in-col/resize-event-provider";
import { MoveEventInRowProvider } from "../event-in-row/move-event-provider";
import { PrepareCreateEventInRowProvider } from "../event-in-row/prepare-create-event-provider";
import { useMinuteClock } from "../../_components/use-minute-clock";
import clsx from "clsx";
import { ResizeEventInRowProvider } from "../event-in-row/resize-event-provider";

export const WEEKLY_CALENDAR_GRID_FIRST_COL_SIZE = 75;
export const WEEKLY_CALENDAR_GRID_TEMPLATE_COLUMNS = `${WEEKLY_CALENDAR_GRID_FIRST_COL_SIZE}px repeat(7,1fr)`;

type WeeklyCalendarProps = { date: Date; events: Event[] };

type WeeklyCalendarImplProps = {
  scrollableRef: RefObject<HTMLDivElement>;
} & WeeklyCalendarProps;

export const WeeklyCalendarImpl: React.FC<WeeklyCalendarImplProps> = ({
  scrollableRef,
  date,
  events,
}) => {
  const { currentDate } = useMinuteClock();
  const { longTermEvents, defaultEvents } = splitEvent(events);

  const week = useMemo(() => {
    const start = startOfDay(startOfWeek(date));
    const end = startOfDay(endOfWeek(date));

    return eachDayOfInterval({ start, end });
  }, [date]);

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEventInCol();
  const { isEventMoving, moveEventActions } = useMoveEventInCol();
  const { isEventResizing, resizeEventActions } = useResizeEventInCol();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;

    if (prepareCreateEventState) {
      prepareCreateEventActions.scroll(scrollTop);
    }

    if (isEventMoving) {
      moveEventActions.scroll(scrollTop);
    }

    if (isEventResizing) {
      resizeEventActions.scroll(scrollTop);
    }
  };

  return (
    <>
      <div className="flex min-h-0 flex-col">
        <WeeklyCalendarDayHeader
          calendarYearMonth={date}
          week={week}
          longTermEvents={longTermEvents}
        />
        <div
          className="flex w-full flex-col overflow-auto"
          style={{ scrollbarWidth: "none" }}
          ref={scrollableRef}
          onScroll={handleScroll}
        >
          <div
            className={clsx("relative grid")}
            style={{
              gridTemplateColumns: WEEKLY_CALENDAR_GRID_TEMPLATE_COLUMNS,
            }}
          >
            <div>
              {eachHourOfInterval({
                start: startOfDay(date),
                end: endOfDay(date),
              }).map((h, i) => {
                return (
                  <div
                    className="relative select-none whitespace-nowrap border-r border-neutral-200 pr-3 text-end tabular-nums text-neutral-400"
                    key={i}
                    style={{
                      height:
                        DATE_EVENT_MIN_HEIGHT * (60 / DATE_EVENT_MIN_MINUTES),
                      top: i !== 0 ? "-5px" : undefined,
                      fontSize: "10px",
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
                  displayedDay={date}
                  events={defaultEvents}
                />
              );
            })}
            <div
              className="absolute grid h-[1px] w-full"
              style={{
                gridTemplateColumns: `${WEEKLY_CALENDAR_GRID_FIRST_COL_SIZE}px 1fr`,
                top:
                  (DATE_EVENT_MIN_HEIGHT / DATE_EVENT_MIN_MINUTES) *
                  differenceInMinutes(currentDate, startOfDay(currentDate)),
              }}
            >
              <div
                className="relative -translate-y-1/2 pr-3 text-end text-xs font-bold"
                style={{
                  width: WEEKLY_CALENDAR_GRID_FIRST_COL_SIZE,
                  fontSize: "10px",
                }}
              >
                {format(currentDate, "hh:mm a")}
              </div>
              <div className="h-[1px] w-full bg-blue-300" />
            </div>
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

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ ...props }) => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  return (
    <PrepareCreateEventInRowProvider>
      <MoveEventInRowProvider>
        <ResizeEventInRowProvider>
          <PrepareCreateEventInColProvider scrollableRef={scrollableRef}>
            <MoveEventInColProvider scrollableRef={scrollableRef}>
              <ResizeEventInColProvider scrollableRef={scrollableRef}>
                <WeeklyCalendarImpl scrollableRef={scrollableRef} {...props} />
              </ResizeEventInColProvider>
            </MoveEventInColProvider>
          </PrepareCreateEventInColProvider>
        </ResizeEventInRowProvider>
      </MoveEventInRowProvider>
    </PrepareCreateEventInRowProvider>
  );
};
