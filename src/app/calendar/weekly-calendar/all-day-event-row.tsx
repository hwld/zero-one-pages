import {
  MoreWeekEventsCard,
  WeekEventCard,
} from "../monthly-calendar/week-event-card";
import { getExceededEventCountByDayOfWeek } from "../monthly-calendar/utils";
import { Event, WeekEvent } from "../type";
import { CELL_Y_MARGIN } from "./all-day-event-cell";
import { EVENT_MIN_HEIGHT } from "./utils";
import { DAY_TITLE_HEIGHT } from "./weekly-calendar-header";
import { DragDateRange, DraggingEvent } from "../utils";
import { useRef } from "react";
import { DraggingEventPreview } from "../monthly-calendar/dragging-event-preview";
import clsx from "clsx";

export const ALL_DAY_EVENT_DISPLAY_LIMIT = 2;

type Props = {
  week: Date[];
  weekAllDayEvents: WeekEvent[];
  isDraggingDate: boolean;
  expanded: boolean;
  onChangeExpand: (expanded: boolean) => void;
  draggingEvent: DraggingEvent | undefined;
  onChangeDraggingEvent: (event: DraggingEvent | undefined) => void;
  dragDateRange: DragDateRange | undefined;
  onChangeDragDateRange: (range: DragDateRange) => void;
};

export const AllDayEventRow: React.FC<Props> = ({
  week,
  weekAllDayEvents,
  isDraggingDate,
  expanded,
  onChangeExpand,
  draggingEvent,
  onChangeDraggingEvent,
  dragDateRange,
  onChangeDragDateRange,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const exceededEvents = getExceededEventCountByDayOfWeek({
    week,
    weekEvents: weekAllDayEvents,
    limit: ALL_DAY_EVENT_DISPLAY_LIMIT,
  });

  const visibleWeekAllDayEvents = weekAllDayEvents.filter((e) => {
    if (expanded) {
      return true;
    }
    return e.top < ALL_DAY_EVENT_DISPLAY_LIMIT;
  });

  const getDateFromX = (x: number) => {
    if (!rowRef.current) {
      throw new Error("");
    }

    const rowRect = rowRef.current.getBoundingClientRect();
    const weekDay = Math.floor((x - rowRect.x) / (rowRect.width / 7));

    return week[weekDay];
  };

  const handleRowMouseDown = (e: React.MouseEvent) => {
    const date = getDateFromX(e.clientX);
    onChangeDragDateRange({ dragStartDate: date, dragEndDate: date });
  };

  const handleRowMouseMove = (e: React.MouseEvent) => {
    const date = getDateFromX(e.clientX);

    if (dragDateRange) {
      onChangeDragDateRange({ ...dragDateRange, dragEndDate: date });
    }

    if (draggingEvent) {
      onChangeDraggingEvent({ ...draggingEvent, dragEndDate: date });
    }
  };

  const handleEventDragStart = (e: React.DragEvent, event: Event) => {
    e.preventDefault();

    const date = getDateFromX(e.clientX);
    onChangeDraggingEvent({ event, dragStartDate: date, dragEndDate: date });
  };

  return (
    <div
      ref={rowRef}
      className="absolute bottom-0 left-0 col-start-2 w-full"
      style={{ top: DAY_TITLE_HEIGHT + CELL_Y_MARGIN }}
      onMouseDown={handleRowMouseDown}
      onMouseMove={handleRowMouseMove}
    >
      {visibleWeekAllDayEvents.map((event) => {
        const isDragging = draggingEvent?.event.id === event.id;

        return (
          <div key={event.id} className={clsx(isDragging && "opacity-50")}>
            <WeekEventCard
              weekEvent={event}
              height={EVENT_MIN_HEIGHT}
              disablePointerEvents={
                isDraggingDate || !!(draggingEvent && !isDragging)
              }
              onMouseDown={(e) => e.stopPropagation()}
              draggable
              onDragStart={(e) => handleEventDragStart(e, event)}
            />
          </div>
        );
      })}
      {expanded
        ? null
        : week.map((date) => {
            const weekDay = date.getDay();
            const count = exceededEvents.get(weekDay);
            if (!count) {
              return null;
            }

            return (
              <MoreWeekEventsCard
                key={weekDay}
                count={count}
                limit={ALL_DAY_EVENT_DISPLAY_LIMIT}
                height={EVENT_MIN_HEIGHT}
                disablePointerEvents={isDraggingDate || !!draggingEvent}
                weekDay={weekDay}
                onClick={() => onChangeExpand(true)}
              />
            );
          })}
      {draggingEvent ? (
        <DraggingEventPreview
          week={week}
          draggingEvent={draggingEvent}
          height={EVENT_MIN_HEIGHT}
        />
      ) : null}
    </div>
  );
};
