import {
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import { NewEvent } from "./new-event";
import {
  EVENT_MIN_HEIGHT,
  EVENT_MIN_MINUTES,
  getDateEvents,
  getDateFromY,
} from "./utils";
import {
  DragEvent,
  MouseEvent,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { DateEvent, DraggingDateEvent, ResizingDateEvent } from "../type";
import { Event } from "../mocks/event-store";
import { DateEventCard } from "./date-event-card/date-event-card";
import { areDragDateRangeOverlapping } from "../utils";
import { DragPreviewDateEventCard } from "./date-event-card/drag-preview";
import { ResizePreviewDateEventCard } from "./date-event-card/resize-preview";
import { MoveEventActions } from "./use-move-event";
import { ResizeEventActions } from "./use-resize-event";
import {
  PrepareCreateEventActions,
  PrepareCreateEventState,
} from "./use-prepare-create-event";

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

  const handleColumnMouseDown = (e: MouseEvent<HTMLDivElement>) => {
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
    const mouseOverDate = getDateFromY(date, y);

    moveEventActions.updateMoveDest(mouseOverDate);
  };

  const updateResizeDest = (mouseY: number) => {
    if (!columnRef.current || !resizingEvent) {
      return;
    }

    const y = mouseY - columnRef.current.getBoundingClientRect().y;
    if (y < 0) {
      return;
    }
    const mouseOverDate = getDateFromY(date, y);

    resizeEventActions.updateResizeDest(mouseOverDate);
  };

  const handleColumnMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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

  const dropPreviewRef = useRef<HTMLDivElement>(null);

  const handleEventDragStart = (
    event: DragEvent<HTMLDivElement>,
    dateEvent: DateEvent,
  ) => {
    event.preventDefault();

    if (!columnRef.current) {
      return;
    }

    const y = event.clientY - columnRef.current?.getBoundingClientRect().y;
    const dragStartDate = getDateFromY(date, y);

    moveEventActions.startMove(dateEvent, dragStartDate);
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

  const isResizePreviewVisible = useMemo(() => {
    if (!resizingEvent) {
      return false;
    }

    return areIntervalsOverlapping(
      {
        start: startOfDay(date),
        end: endOfDay(date),
      },
      resizingEvent,
    );
  }, [date, resizingEvent]);

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
        {dateEvents.map((event) => {
          const dragging = event.id === movingEvent?.id;
          const isResizing = resizingEvent?.id === event.id;

          return (
            <DateEventCard
              key={event.id}
              hidden={isResizing}
              displayedDate={date}
              event={event}
              onDragStart={handleEventDragStart}
              dragging={dragging}
              draggingOther={movingEvent ? !dragging : false}
              isResizing={isResizing}
              isResizingOther={resizingEvent ? !isResizing : false}
              resizeEventActions={resizeEventActions}
            />
          );
        })}
        <DragPreviewDateEventCard
          date={date}
          ref={dropPreviewRef}
          event={movingEvent}
          visible={isDragPreviewVisible}
        />
        <ResizePreviewDateEventCard
          date={date}
          event={resizingEvent}
          visible={isResizePreviewVisible}
        />
      </div>
    </div>
  );
});
