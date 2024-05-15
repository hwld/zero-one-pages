import { PropsWithChildren, useEffect, useRef } from "react";
import { DATE_EVENT_MIN_HEIGHT } from "./utils";
import { DateEvent } from "./type";
import { areDragDateRangeOverlapping } from "@/app/calendar/utils";
import { startOfDay, endOfDay, areIntervalsOverlapping } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { DateEventCardProps, DateEventCard } from "./card/date-event-card";
import { DragPreviewDateEventCard } from "./card/drag-preview";
import { DateEventPreview } from "./date-event-preview";
import { useMoveDateEvent } from "./move-event-provider";
import { usePrepareCreateDateEvent } from "./prepare-create-event-provider";
import { useResizeDateEvent } from "./resize-event-provider";

type Props = {
  dateEvents: DateEvent[];
  displayedDay: Date;
} & PropsWithChildren;

export const DateEventsColumn: React.FC<Props> = ({
  children,
  displayedDay,
  dateEvents,
}) => {
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateDateEvent();
  const { isEventResizing, resizeEventActions, resizeEventPreview } =
    useResizeDateEvent();
  const { isEventMoving, moveEventActions, moveEventPreview } =
    useMoveDateEvent();

  const dragDateRangeForCreate = prepareCreateEventState.dragDateRange;
  const isDraggingForCreate = dragDateRangeForCreate !== undefined;

  const columnRef = useRef<HTMLDivElement>(null);

  const handleColumnMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!columnRef.current || e.button !== 0) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = e.clientY - columnY;

    prepareCreateEventActions.startDrag(displayedDay, y);
  };

  const updateDragDateRangeForCreate = (mouseY: number) => {
    if (!isDraggingForCreate || !columnRef.current) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = mouseY - columnY;

    prepareCreateEventActions.updateDragEnd(displayedDay, y);
  };

  const updateMoveDest = (mouseY: number) => {
    if (!moveEventPreview || !columnRef.current) {
      return;
    }

    const columnRect = columnRef.current.getBoundingClientRect();
    const y = mouseY - columnRect.y;

    moveEventActions.updateMoveDest(displayedDay, y);
  };

  const updateResizeDest = (mouseY: number) => {
    if (!columnRef.current || !isEventResizing) {
      return;
    }

    const y = mouseY - columnRef.current.getBoundingClientRect().y;
    if (y < 0) {
      return;
    }

    resizeEventActions.updateResizeDest(displayedDay, y);
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
    moveEventActions.startMove(dateEvent, { date: displayedDay, y });
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
    areDragDateRangeOverlapping(displayedDay, dragDateRangeForCreate);

  return (
    <div
      ref={columnRef}
      className="relative"
      style={{ height: DATE_EVENT_MIN_HEIGHT * 4 * 24 }}
      draggable={false}
      onMouseDown={handleColumnMouseDown}
      onMouseMove={handleColumnMouseMove}
    >
      {children}
      {isEventPreviewVisible && (
        <DateEventPreview
          date={displayedDay}
          eventCreationDragData={dragDateRangeForCreate}
        />
      )}
      <AnimatePresence>
        {dateEvents.map((event) => {
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
                displayedDate={displayedDay}
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
          start: startOfDay(displayedDay),
          end: endOfDay(displayedDay),
        }) && (
          <DragPreviewDateEventCard
            date={displayedDay}
            event={moveEventPreview}
          />
        )}
    </div>
  );
};
