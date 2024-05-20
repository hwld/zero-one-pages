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
import { Placement } from "@floating-ui/react";

type Props = {
  dateEvents: DateEvent[];
  displayedDay: Date;
  eventPopoverPlace?: Placement;
} & PropsWithChildren;

export const DateEventsColumn: React.FC<Props> = ({
  children,
  displayedDay,
  dateEvents,
  eventPopoverPlace,
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

  const getColumnBasedY = (y: number) => {
    if (!columnRef.current) {
      throw new Error("columnRefがセットされていません");
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    return y - columnY;
  };

  const handleColumnMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0) {
      return;
    }

    const columnBasedY = getColumnBasedY(e.clientY);
    prepareCreateEventActions.startDrag(displayedDay, columnBasedY);
  };

  const updateDragDateRangeForCreate = (mouseY: number) => {
    if (!isDraggingForCreate) {
      return;
    }

    const columnBasedY = getColumnBasedY(mouseY);
    prepareCreateEventActions.updateDragEnd(displayedDay, columnBasedY);
  };

  const updateMoveDest = (mouseY: number) => {
    if (!isEventMoving) {
      return;
    }

    const columnBasedY = getColumnBasedY(mouseY);
    moveEventActions.updateMoveDest(displayedDay, columnBasedY);
  };

  const updateResizeDest = (mouseY: number) => {
    if (!isEventResizing) {
      return;
    }

    const columnBasedY = getColumnBasedY(mouseY);
    if (columnBasedY < 0) {
      return;
    }

    resizeEventActions.updateResizeDest(displayedDay, columnBasedY);
  };

  const handleColumnMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDraggingForCreate) {
      updateDragDateRangeForCreate(e.clientY);
    }

    if (isEventMoving) {
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

    const columnBasedY = getColumnBasedY(event.clientY);
    moveEventActions.startMove(dateEvent, {
      date: displayedDay,
      y: columnBasedY,
    });
  };

  const handleStartResizeEvent: DateEventCardProps["onStartResize"] = (
    e,
    { event, origin },
  ) => {
    const columnBasedY = getColumnBasedY(e.clientY);
    resizeEventActions.startResize({ event, origin, y: columnBasedY });
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
                popoverPlace={eventPopoverPlace}
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
