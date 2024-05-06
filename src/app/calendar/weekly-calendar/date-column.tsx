import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  isSameMinute,
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
  MutableRefObject,
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { DateEvent, DraggingDateEvent, ResizingDateEvent } from "../type";
import { Event } from "../mocks/event-store";
import { DateEventCard } from "./date-event-card/date-event-card";
import { DragDateRange, areDragDateRangeOverlapping } from "../utils";
import { DragPreviewDateEventCard } from "./date-event-card/drag-preview";
import { ResizePreviewDateEventCard } from "./date-event-card/resize-preview";

export type MouseHistory = { y: number; scrollTop: number };

export type EventCreationDragData = {
  targetDate: Date;
  startDate: Date;
  endDate: Date;
};

type Props = {
  currentDate: Date;
  date: Date;
  events: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onChangeDraggingEvent: (event: DraggingDateEvent | undefined) => void;
  scrollableRef: RefObject<HTMLDivElement>;
  mouseHistoryRef: MutableRefObject<MouseHistory | undefined>;
  eventCreationDragData: DragDateRange | undefined;
  onChangeEventCreationDragData: (range: DragDateRange | undefined) => void;
  resizingEvent: ResizingDateEvent | undefined;
  onChangeResizingEvent: (event: ResizingDateEvent | undefined) => void;
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  {
    currentDate,
    date,
    events,
    draggingEvent,
    onChangeDraggingEvent,
    scrollableRef,
    mouseHistoryRef,
    eventCreationDragData,
    onChangeEventCreationDragData,
    resizingEvent,
    onChangeResizingEvent,
  },
  ref,
) {
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

    if (!columnRef.current || !scrollableRef.current || e.button !== 0) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = e.clientY - columnY;

    mouseHistoryRef.current = {
      y,
      scrollTop: scrollableRef.current.scrollTop,
    };

    const targetDate = startOfDay(date);

    // ドラッグ開始の時点では常にクリックした最小領域が期間として設定されるようにする
    const dragStartDate = getDateFromY(targetDate, y, "floor");
    const dragEndDate = addMinutes(dragStartDate, EVENT_MIN_MINUTES);

    onChangeEventCreationDragData({
      dragStartDate,
      dragEndDate,
    });
  };

  const updateEventCreationDragData = (mouseY: number) => {
    if (
      !eventCreationDragData ||
      !columnRef.current ||
      !scrollableRef.current
    ) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = mouseY - columnY;

    mouseHistoryRef.current = {
      y,
      scrollTop: scrollableRef.current.scrollTop,
    };
    const dragEndDate = getDateFromY(date, y);

    onChangeEventCreationDragData({
      ...eventCreationDragData,
      dragEndDate,
    });
  };

  const updateDraggingEvent = (mouseY: number) => {
    if (!draggingEvent || !dropPreviewRef.current || !columnRef.current) {
      return;
    }

    const columnRect = columnRef.current.getBoundingClientRect();

    const y = mouseY - columnRect.y;
    const mouseOverDate = getDateFromY(date, y);

    if (isSameMinute(mouseOverDate, draggingEvent.prevMouseOverDate)) {
      return;
    }

    const diffMinutes = differenceInMinutes(
      mouseOverDate,
      draggingEvent.prevMouseOverDate,
    );

    onChangeDraggingEvent({
      ...draggingEvent,
      start: addMinutes(draggingEvent.start, diffMinutes),
      end: addMinutes(draggingEvent.end, diffMinutes),
      prevMouseOverDate: mouseOverDate,
    });
  };

  const updateResizingEventState = (mouseY: number) => {
    if (!columnRef.current || !resizingEvent) {
      return;
    }

    const y = mouseY - columnRef.current.getBoundingClientRect().y;
    if (y < 0) {
      return;
    }

    const mouseOverDate = getDateFromY(date, y);

    switch (resizingEvent.origin) {
      case "eventStart": {
        if (isSameMinute(resizingEvent.start, mouseOverDate)) {
          return;
        }

        if (isBefore(mouseOverDate, resizingEvent.start)) {
          onChangeResizingEvent({
            ...resizingEvent,
            origin: "eventEnd",
            start: mouseOverDate,
            end: resizingEvent.start,
          });
        } else {
          onChangeResizingEvent({
            ...resizingEvent,
            end: mouseOverDate,
          });
        }
        return;
      }
      case "eventEnd": {
        if (isSameMinute(resizingEvent.end, mouseOverDate)) {
          return;
        }

        if (isAfter(mouseOverDate, resizingEvent.end)) {
          onChangeResizingEvent({
            ...resizingEvent,
            origin: "eventStart",
            start: resizingEvent.end,
            end: mouseOverDate,
          });
        } else {
          onChangeResizingEvent({
            ...resizingEvent,
            start: mouseOverDate,
          });
        }
        return;
      }
      default: {
        throw new Error(resizingEvent.origin satisfies never);
      }
    }
  };

  const handleColumnMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (eventCreationDragData) {
      updateEventCreationDragData(e.clientY);
    }

    if (draggingEvent) {
      updateDraggingEvent(e.clientY);
    }

    if (resizingEvent) {
      updateResizingEventState(e.clientY);
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

    onChangeDraggingEvent({
      ...dateEvent,
      prevMouseOverDate: dragStartDate,
    });
  };

  const isDragPreviewVisible = useMemo(() => {
    if (!draggingEvent) {
      return false;
    }

    return areIntervalsOverlapping(
      {
        start: startOfDay(date),
        end: endOfDay(date),
      },
      draggingEvent,
    );
  }, [date, draggingEvent]);

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
        {eventCreationDragData &&
          areDragDateRangeOverlapping(date, eventCreationDragData) && (
            <NewEvent
              date={date}
              eventCreationDragData={eventCreationDragData}
            />
          )}
        {dateEvents.map((event) => {
          const dragging = event.id === draggingEvent?.id;
          const isResizing = resizingEvent?.id === event.id;

          return (
            <DateEventCard
              key={event.id}
              hidden={isResizing}
              displayedDate={date}
              event={event}
              onDragStart={handleEventDragStart}
              dragging={dragging}
              draggingOther={draggingEvent ? !dragging : false}
              isResizing={isResizing}
              isResizingOther={resizingEvent ? !isResizing : false}
              onChangeResizingEvent={onChangeResizingEvent}
            />
          );
        })}
        <DragPreviewDateEventCard
          date={date}
          ref={dropPreviewRef}
          event={draggingEvent}
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
