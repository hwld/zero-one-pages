import clsx from "clsx";
import { WEEKLY_CALENDAR_GRID_COLS_CLASS } from "./weekly-calendar";
import { WEEK_DAY_LABELS } from "../consts";
import { AllDayEventCell } from "./all-day-event-cell";
import { Event } from "../type";
import { useEffect, useState } from "react";
import { DragDateRange } from "../utils";
import { max, min } from "date-fns";
import { AllDayEventRow } from "./all-day-event-row";
import { getWeekEvents } from "../monthly-calendar/utils";
import { TbArrowsDiagonal2, TbArrowsDiagonalMinimize } from "react-icons/tb";

export const DAY_TITLE_HEIGHT = 20;

type Props = {
  week: Date[];
  allDayEvents: Event[];
  onCreateEvent: (event: Event) => void;
};

export const WeeklyCalendarDayHeader: React.FC<Props> = ({
  week,
  allDayEvents,
  onCreateEvent,
}) => {
  const [expanded, setExpanded] = useState(false);

  const weekAllDayEvents = getWeekEvents({ week, events: allDayEvents });

  const [dragDateRange, setDragDateRange] = useState<DragDateRange | undefined>(
    undefined,
  );
  useEffect(() => {
    const createEvent = () => {
      if (!dragDateRange) {
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

    document.addEventListener("mouseup", createEvent);
    return () => {
      document.removeEventListener("mouseup", createEvent);
    };
  }, [dragDateRange, onCreateEvent]);

  return (
    <div
      className={clsx(
        "sticky top-0 z-30 grid bg-neutral-100",
        WEEKLY_CALENDAR_GRID_COLS_CLASS,
      )}
    >
      <div className="flex select-none flex-col">
        <div className="h-5" />
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
              className="z-30 flex select-none items-center justify-center gap-1 pb-2 text-xs"
              style={{ height: DAY_TITLE_HEIGHT }}
            >
              <div>{WEEK_DAY_LABELS[date.getDay()]}</div>
              <div>{date.getDate()}</div>
            </div>
            <AllDayEventCell
              date={date}
              events={weekAllDayEvents}
              dragDateRange={dragDateRange}
              onDragDateRangeChange={setDragDateRange}
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
      />
    </div>
  );
};
