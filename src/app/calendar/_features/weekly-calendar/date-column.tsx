import {
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import { DateEventPreview } from "../event/date-event/date-event-preview";
import {
  DATE_EVENT_MIN_HEIGHT,
  DATE_EVENT_MIN_MINUTES,
} from "../event/date-event/utils";
import { getDateEvents } from "../event/date-event/utils";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { DateEvent } from "../event/date-event/type";
import { Event } from "../../_mocks/event-store";
import {
  DateEventCard,
  DateEventCardProps,
} from "../event/date-event/card/date-event-card";
import { areDragDateRangeOverlapping } from "../utils";
import { DragPreviewDateEventCard } from "../event/date-event/card/drag-preview";
import { useMoveEvent } from "./move-event-provider";
import { useResizeEvent } from "./resize-event-provider";
import { AnimatePresence, motion } from "framer-motion";
import { usePrepareCreateEvent } from "./prepare-create-event-provider";

export type EventCreationDragData = {
  targetDate: Date;
  startDate: Date;
  endDate: Date;
};

type Props = {
  currentDate: Date;
  date: Date;
  events: Event[];
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  { currentDate, date, events },
  ref,
) {
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEvent();
  const { isEventResizing, resizeEventActions, resizeEventPreview } =
    useResizeEvent();
  const { isEventMoving, moveEventActions, moveEventPreview } = useMoveEvent();

  const dragDateRangeForCreate = prepareCreateEventState.dragDateRange;
  const isDraggingForCreate = dragDateRangeForCreate !== undefined;

  const columnRef = useRef<HTMLDivElement>(null);
  const displayedDateEvents = getDateEvents({
    date,
    // 楽観的更新をUIレベルで実装する。
    events: events.map((event): Event => {
      const resizePreviewVisible = event.id === resizeEventPreview?.id;
      const movePreviewVisible =
        !isEventMoving && event.id === moveEventPreview?.id;

      if (isEventMoving && event.id === moveEventPreview?.id) {
        return event;
      }

      if (resizePreviewVisible && movePreviewVisible) {
        if (resizeEventPreview.updatedAt > moveEventPreview.updatedAt) {
          return resizeEventPreview;
        } else {
          return moveEventPreview;
        }
      }

      if (movePreviewVisible) {
        return moveEventPreview;
      }

      if (resizePreviewVisible) {
        return resizeEventPreview;
      }

      return event;
    }),
  });

  const hours = useMemo(
    () =>
      eachHourOfInterval({
        start: startOfDay(date),
        end: endOfDay(date),
      }),
    [date],
  );

  const handleColumnMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!columnRef.current || e.button !== 0) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = e.clientY - columnY;

    prepareCreateEventActions.startDrag(date, y);
  };

  const updateDragDateRangeForCreate = (mouseY: number) => {
    if (!isDraggingForCreate || !columnRef.current) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = mouseY - columnY;

    prepareCreateEventActions.updateDragEnd(date, y);
  };

  const updateMoveDest = (mouseY: number) => {
    if (!moveEventPreview || !columnRef.current) {
      return;
    }

    const columnRect = columnRef.current.getBoundingClientRect();
    const y = mouseY - columnRect.y;

    moveEventActions.updateMoveDest(date, y);
  };

  const updateResizeDest = (mouseY: number) => {
    if (!columnRef.current || !isEventResizing) {
      return;
    }

    const y = mouseY - columnRef.current.getBoundingClientRect().y;
    if (y < 0) {
      return;
    }

    resizeEventActions.updateResizeDest(date, y);
  };

  const handleColumnMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDraggingForCreate) {
      updateDragDateRangeForCreate(e.clientY);
    }

    if (moveEventPreview) {
      updateMoveDest(e.clientY);
    }

    if (isEventResizing) {
      updateResizeDest(e.clientY);
    }
  };

  const handleEventDragStart = (
    event: React.DragEvent,
    dateEvent: DateEvent,
  ) => {
    event.preventDefault();

    if (!columnRef.current) {
      return;
    }

    const y = event.clientY - columnRef.current?.getBoundingClientRect().y;
    moveEventActions.startMove(dateEvent, { date, y });
  };

  const handleStartResizeEvent: DateEventCardProps["onStartResize"] = (
    e,
    { event, origin },
  ) => {
    if (!columnRef.current) {
      return;
    }

    const y = e.clientY - columnRef.current.getBoundingClientRect().y;
    resizeEventActions.startResize({ event, origin, y });
  };

  const currentTimeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!currentTimeRef.current) {
      return;
    }

    currentTimeRef.current.scrollIntoView({ block: "center" });
  }, []);

  const isEventPreviewVisible =
    dragDateRangeForCreate &&
    areDragDateRangeOverlapping(date, dragDateRangeForCreate);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <div
        ref={columnRef}
        className="relative border-r border-neutral-200"
        style={{ height: DATE_EVENT_MIN_HEIGHT * 4 * 24 }}
        draggable={false}
        onMouseDown={handleColumnMouseDown}
        onMouseMove={handleColumnMouseMove}
      >
        {hours.map((hour, i) => {
          if (i === 0) {
            return null;
          }
          return (
            <div
              key={`${hour}`}
              className="absolute h-[1px] w-full bg-neutral-200"
              style={{ top: DATE_EVENT_MIN_HEIGHT * 4 * i }}
            />
          );
        })}
        {isSameDay(currentDate, date) ? (
          <div
            ref={currentTimeRef}
            className="absolute z-30 h-[1px] w-full border-y-[1px] border-blue-500 bg-blue-500"
            style={{
              top:
                (DATE_EVENT_MIN_HEIGHT / DATE_EVENT_MIN_MINUTES) *
                differenceInMinutes(currentDate, startOfDay(currentDate)),
            }}
          >
            <div className="absolute left-0 size-3 -translate-x-[50%] -translate-y-[50%] rounded-full bg-blue-500" />
          </div>
        ) : null}
        {isEventPreviewVisible && (
          <DateEventPreview
            date={date}
            eventCreationDragData={dragDateRangeForCreate}
          />
        )}
        <AnimatePresence>
          {displayedDateEvents.map((event) => {
            const isDragPreview = moveEventPreview?.id === event.id;
            const isResizePreview = resizeEventPreview?.id === event.id;

            const isDragging = isEventMoving && isDragPreview;
            const isResizing = isEventResizing && isResizePreview;

            return (
              <motion.div
                key={event.id}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <DateEventCard
                  displayedDate={date}
                  event={event}
                  isDragging={isDragging}
                  isOtherEventDragging={isEventMoving ? !isDragging : false}
                  onDragStart={handleEventDragStart}
                  isResizing={isResizing}
                  isOtherEventResizing={isEventResizing ? !isResizing : false}
                  onStartResize={handleStartResizeEvent}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isEventMoving &&
          moveEventPreview &&
          areIntervalsOverlapping(moveEventPreview, {
            start: startOfDay(date),
            end: endOfDay(date),
          }) && (
            <DragPreviewDateEventCard date={date} event={moveEventPreview} />
          )}
      </div>
    </div>
  );
});
