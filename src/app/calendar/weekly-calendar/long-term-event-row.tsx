import {
  MoreWeekEventsCard,
  WeekEventCard,
} from "../monthly-calendar/week-event-card";
import { getExceededEventCountByDayOfWeek } from "../monthly-calendar/utils";
import { WeekEvent } from "../type";
import { Event } from "../mocks/event-store";
import { CELL_Y_MARGIN } from "./long-term-event-cell";
import { EVENT_MIN_HEIGHT } from "./utils";
import { DAY_TITLE_HEIGHT } from "./weekly-calendar-header";
import { DraggingEvent } from "../utils";
import { useRef } from "react";
import { DraggingEventPreview } from "../monthly-calendar/dragging-event-preview";
import clsx from "clsx";
import {
  PrepareCreateEventActions,
  PrepareCreateEventState,
} from "../monthly-calendar/use-prepare-create-event";
import { MoveEventActions } from "../monthly-calendar/use-move-event";

export const LONG_TERM_EVENT_DISPLAY_LIMIT = 2;

type Props = {
  week: Date[];
  weekLongTermEvents: WeekEvent[];

  expanded: boolean;
  onChangeExpand: (expanded: boolean) => void;

  movingEvent: DraggingEvent | undefined;
  moveEventActions: MoveEventActions;

  prepareCreateEventState: PrepareCreateEventState;
  prepareCreateEventActions: PrepareCreateEventActions;
};

export const LongTermEventRow: React.FC<Props> = ({
  week,
  weekLongTermEvents,
  expanded,
  onChangeExpand,
  movingEvent,
  moveEventActions,
  prepareCreateEventState,
  prepareCreateEventActions,
}) => {
  const isDraggingForCreate =
    prepareCreateEventState.dragDateRange !== undefined;

  const rowRef = useRef<HTMLDivElement>(null);
  const exceededEvents = getExceededEventCountByDayOfWeek({
    week,
    weekEvents: weekLongTermEvents,
    limit: LONG_TERM_EVENT_DISPLAY_LIMIT,
  });

  const visibleWeekLongTermEvents = weekLongTermEvents.filter((e) => {
    if (expanded) {
      return true;
    }
    return e.top < LONG_TERM_EVENT_DISPLAY_LIMIT;
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
    prepareCreateEventActions.startDrag(date);
  };

  const handleRowMouseMove = (e: React.MouseEvent) => {
    const date = getDateFromX(e.clientX);

    if (isDraggingForCreate) {
      prepareCreateEventActions.updateDragEnd(date);
    }

    if (movingEvent) {
      moveEventActions.updateMoveEnd(date);
    }
  };

  const handleEventDragStart = (e: React.DragEvent, event: Event) => {
    e.preventDefault();

    const date = getDateFromX(e.clientX);
    moveEventActions.startMove(event, date);
  };

  return (
    <div
      ref={rowRef}
      className="absolute bottom-0 left-0 col-start-2 w-full"
      style={{ top: DAY_TITLE_HEIGHT + CELL_Y_MARGIN }}
      onMouseDown={handleRowMouseDown}
      onMouseMove={handleRowMouseMove}
    >
      {visibleWeekLongTermEvents.map((event) => {
        const isMoving = movingEvent?.event.id === event.id;

        return (
          <div key={event.id} className={clsx(isMoving && "opacity-50")}>
            <WeekEventCard
              weekEvent={event}
              height={EVENT_MIN_HEIGHT}
              disablePointerEvents={
                isDraggingForCreate || !!(movingEvent && !isMoving)
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
                limit={LONG_TERM_EVENT_DISPLAY_LIMIT}
                height={EVENT_MIN_HEIGHT}
                disablePointerEvents={isDraggingForCreate || !!movingEvent}
                weekDay={weekDay}
                onClick={() => onChangeExpand(true)}
              />
            );
          })}
      {movingEvent ? (
        <DraggingEventPreview
          week={week}
          draggingEvent={movingEvent}
          height={EVENT_MIN_HEIGHT}
        />
      ) : null}
    </div>
  );
};
