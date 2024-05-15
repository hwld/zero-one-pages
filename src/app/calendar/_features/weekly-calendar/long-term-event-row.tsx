import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { DragPreviewWeekEventsCard } from "../event/week-event/card/drag-preview";
import { MoreWeekEventsCard } from "../event/week-event/card/more-week-even";
import { WeekEventCard } from "../event/week-event/card/week-event-card";
import { WeekEvent } from "../event/week-event/type";
import { getExceededEventCountByDayOfWeek } from "../event/week-event/utils";
import { CELL_Y_MARGIN } from "./long-term-event-cell";
import { DATE_EVENT_MIN_HEIGHT } from "../event/date-event/utils";
import { DAY_TITLE_HEIGHT } from "./weekly-calendar-header";
import { usePrepareCreateWeekEvent } from "../event/week-event/prepare-create-event-provider";
import { useMoveWeekEvent } from "../event/week-event/move-event-provider";

export const LONG_TERM_EVENT_DISPLAY_LIMIT = 2;

type Props = {
  week: Date[];
  weekLongTermEvents: WeekEvent[];

  expanded: boolean;
  onChangeExpand: (expanded: boolean) => void;
};

export const LongTermEventRow: React.FC<Props> = ({
  week,
  weekLongTermEvents,
  expanded,
  onChangeExpand,
}) => {
  const {
    isEventMoving,
    moveEventPreview: moveEventPreview,
    moveEventActions: moveEventActions,
  } = useMoveWeekEvent();
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateWeekEvent();

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

    if (moveEventPreview) {
      moveEventActions.updateMoveEnd(date);
    }
  };

  const handleEventDragStart = (e: React.DragEvent, event: WeekEvent) => {
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
      <AnimatePresence>
        {visibleWeekLongTermEvents.map((event) => {
          const isDragging =
            isEventMoving && moveEventPreview?.event.id === event.id;

          return (
            <motion.div
              key={event.id}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <WeekEventCard
                weekEvent={event}
                isDragging={isDragging}
                height={DATE_EVENT_MIN_HEIGHT}
                disablePointerEvents={isDraggingForCreate || isEventMoving}
                onMouseDown={(e) => e.stopPropagation()}
                draggable
                onDragStart={(e) => handleEventDragStart(e, event)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
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
                height={DATE_EVENT_MIN_HEIGHT}
                disablePointerEvents={isDraggingForCreate || isEventMoving}
                weekDay={weekDay}
                onClick={() => onChangeExpand(true)}
              />
            );
          })}
      {isEventMoving && moveEventPreview && (
        <DragPreviewWeekEventsCard
          week={week}
          draggingEvent={moveEventPreview}
          height={DATE_EVENT_MIN_HEIGHT}
        />
      )}
    </div>
  );
};
