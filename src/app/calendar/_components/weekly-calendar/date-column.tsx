import {
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import { NewEvent } from "./new-event";
import { EVENT_MIN_HEIGHT, EVENT_MIN_MINUTES, getDateEvents } from "./utils";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { DateEvent, DraggingDateEvent, ResizingDateEvent } from "../../type";
import { Event } from "../../_mocks/event-store";
import {
  DateEventCard,
  DateEventCardProps,
} from "./date-event-card/date-event-card";
import { areDragDateRangeOverlapping } from "../utils";
import { DragPreviewDateEventCard } from "./date-event-card/drag-preview";
import { MoveEventActions } from "./use-move-event-effect";
import { ResizeEventActions } from "./use-resize-event-effect";
import {
  PrepareCreateEventActions,
  PrepareCreateEventState,
} from "./use-prepare-create-event-effect";
import { AnimatePresence, motion } from "framer-motion";

export type EventCreationDragData = {
  targetDate: Date;
  startDate: Date;
  endDate: Date;
};

type Props = {
  currentDate: Date;
  date: Date;
  events: Event[];
  movingEvent: DraggingDateEvent | undefined;
  moveEventActions: MoveEventActions;

  prepareCreateEventState: PrepareCreateEventState;
  prepareCreateEventActions: PrepareCreateEventActions;

  isEventResizing: boolean;
  resizingEvent: ResizingDateEvent | undefined;
  resizeEventActions: ResizeEventActions;
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  {
    currentDate,
    date,
    events,
    movingEvent,
    moveEventActions,
    prepareCreateEventState,
    prepareCreateEventActions,
    isEventResizing,
    resizingEvent,
    resizeEventActions,
  },
  ref,
) {
  const dragDateRangeForCreate = prepareCreateEventState.dragDateRange;
  const isDraggingForCreate = dragDateRangeForCreate !== undefined;

  const columnRef = useRef<HTMLDivElement>(null);
  const dateEvents = getDateEvents({ date, events: events });

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
    if (!movingEvent || !dropPreviewRef.current || !columnRef.current) {
      return;
    }

    const columnRect = columnRef.current.getBoundingClientRect();
    const y = mouseY - columnRect.y;

    moveEventActions.updateMoveDest(date, y);
  };

  const updateResizeDest = (mouseY: number) => {
    if (!columnRef.current || !resizingEvent) {
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

    if (movingEvent) {
      updateMoveDest(e.clientY);
    }

    if (resizingEvent) {
      updateResizeDest(e.clientY);
    }
  };

  const dropPreviewRef = useRef<HTMLButtonElement>(null);

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

  const isDragPreviewVisible = useMemo(() => {
    if (!movingEvent) {
      return false;
    }

    return areIntervalsOverlapping(
      {
        start: startOfDay(date),
        end: endOfDay(date),
      },
      movingEvent,
    );
  }, [movingEvent, date]);

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
        className="relative border-r border-neutral-300"
        style={{ height: EVENT_MIN_HEIGHT * 4 * 24 }}
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
              className="absolute h-[1px] w-full bg-neutral-300"
              style={{ top: EVENT_MIN_HEIGHT * 4 * i }}
            />
          );
        })}
        {isSameDay(currentDate, date) ? (
          <div
            ref={currentTimeRef}
            className="absolute z-30 h-[1px] w-full border-y-[1px] border-blue-500 bg-blue-500"
            style={{
              top:
                (EVENT_MIN_HEIGHT / EVENT_MIN_MINUTES) *
                differenceInMinutes(currentDate, startOfDay(currentDate)),
            }}
          >
            <div className="absolute left-0 size-3 -translate-x-[50%] -translate-y-[50%] rounded-full bg-blue-500" />
          </div>
        ) : null}
        {isEventPreviewVisible && (
          <NewEvent
            date={date}
            eventCreationDragData={dragDateRangeForCreate}
          />
        )}
        <AnimatePresence>
          {dateEvents.map((event) => {
            const dragging = event.id === movingEvent?.id;

            return (
              <motion.div
                key={event.id}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <DateEventCard
                  key={event.id}
                  displayedDate={date}
                  event={event}
                  onDragStart={handleEventDragStart}
                  dragging={dragging}
                  draggingOther={movingEvent ? !dragging : false}
                  isSomeEventResizing={isEventResizing}
                  resizingEvent={resizingEvent}
                  onStartResize={handleStartResizeEvent}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <DragPreviewDateEventCard
          date={date}
          ref={dropPreviewRef}
          event={movingEvent}
          visible={isDragPreviewVisible}
        />
      </div>
    </div>
  );
});
