import clsx from "clsx";
import { WEEKLY_CALENDAR_GRID_COLS_CLASS } from "./weekly-calendar";
import { WEEK_DAY_LABELS } from "../consts";
import { AllDayEventCell } from "./all-day-event-cell";
import { Event } from "../type";
import { useEffect, useState } from "react";
import { DragDateRange, DragEvent, getEventFromDragEvent } from "../utils";
import { isSameDay, max, min } from "date-fns";
import { AllDayEventRow } from "./all-day-event-row";
import { getWeekEvents } from "../monthly-calendar/utils";
import { TbArrowsDiagonal2, TbArrowsDiagonalMinimize } from "react-icons/tb";

export const DAY_TITLE_HEIGHT = 28;

type Props = {
  currentDate: Date;
  week: Date[];
  allDayEvents: Event[];
  onCreateEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
};

export const WeeklyCalendarDayHeader: React.FC<Props> = ({
  currentDate,
  week,
  allDayEvents,
  onCreateEvent,
  onUpdateEvent,
}) => {
  const [expanded, setExpanded] = useState(false);

  const weekAllDayEvents = getWeekEvents({ week, events: allDayEvents });

  const [dragDateRange, setDragDateRange] = useState<DragDateRange | undefined>(
    undefined,
  );
  useEffect(() => {
    const createAllDayEvent = (e: MouseEvent) => {
      if (!dragDateRange || e.button !== 0) {
        return;
      }

      const { dragStartDate, dragEndDate } = dragDateRange;

      const start = min([dragStartDate, dragEndDate]);
      const end = max([dragStartDate, dragEndDate]);

      onCreateEvent({
        id: crypto.randomUUID(),
        title: "event",
        allDay: true,
        start,
        end,
      });
      setDragDateRange(undefined);
    };

    document.addEventListener("mouseup", createAllDayEvent);
    return () => {
      document.removeEventListener("mouseup", createAllDayEvent);
    };
  }, [dragDateRange, onCreateEvent]);

  const [dragAllDayEvent, setDragAllDayEvent] = useState<DragEvent | undefined>(
    undefined,
  );

  useEffect(() => {
    const moveAllDayEvent = (e: MouseEvent) => {
      if (!dragAllDayEvent || e.button !== 0) {
        return;
      }

      const newEvent = getEventFromDragEvent(dragAllDayEvent);
      onUpdateEvent(newEvent);

      setDragAllDayEvent(undefined);
    };

    document.addEventListener("mouseup", moveAllDayEvent);
    return () => {
      document.removeEventListener("mouseup", moveAllDayEvent);
    };
  }, [dragAllDayEvent, onUpdateEvent]);

  return (
    <div
      className={clsx(
        "sticky top-0 z-40 grid bg-neutral-100",
        WEEKLY_CALENDAR_GRID_COLS_CLASS,
      )}
    >
      <div className="flex select-none flex-col">
        <div style={{ height: DAY_TITLE_HEIGHT }} />
        <div className="flex grow items-start justify-center border-y border-r border-neutral-300 py-1 text-xs text-neutral-400">
          <div className="flex items-center gap-1">
            終日
            <button
              className="grid size-6 place-items-center rounded text-[14px] text-neutral-500 transition-colors hover:bg-neutral-500/15"
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <TbArrowsDiagonalMinimize className="rotate-45" />
              ) : (
                <TbArrowsDiagonal2 className="rotate-45" />
              )}
            </button>
          </div>
        </div>
      </div>
      {week.map((date) => {
        return (
          <div className="flex flex-col" key={`${date}`}>
            <div
              className="flex select-none items-center justify-center gap-1 pb-1 text-xs"
              style={{ height: DAY_TITLE_HEIGHT }}
            >
              <div>{WEEK_DAY_LABELS[date.getDay()]}</div>
              <div
                className={clsx(
                  "grid size-5 place-items-center rounded",
                  isSameDay(currentDate, date) &&
                    "bg-blue-500 text-neutral-100",
                )}
              >
                {date.getDate()}
              </div>
            </div>
            <AllDayEventCell
              date={date}
              events={weekAllDayEvents}
              dragDateRange={dragDateRange}
              expanded={expanded}
            />
          </div>
        );
      })}
      <AllDayEventRow
        week={week}
        weekAllDayEvents={weekAllDayEvents}
        isDraggingDate={!!dragDateRange}
        expanded={expanded}
        onExpandChange={setExpanded}
        dragEvent={dragAllDayEvent}
        onChangeDragEvent={setDragAllDayEvent}
        dragDateRange={dragDateRange}
        onChangeDragDateRange={setDragDateRange}
      />
    </div>
  );
};
