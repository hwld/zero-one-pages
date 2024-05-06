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
  getHeightFromInterval,
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
import {
  DateEvent,
  DraggingDateEvent,
  Event,
  ResizingDateEventState,
} from "../type";
import { DateEventCard, PreviewDateEventCard } from "./date-event-card";
import { DragDateRange, areDragDateRangeOverlapping } from "../utils";

export type MouseHistory = { y: number; scrollTop: number };

export type EventCreationDragData = {
  targetDate: Date;
  startDate: Date;
  endDate: Date;
};

type Props = {
  currentDate: Date;
  date: Date;
  timedEvents: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onChangeDraggingEvent: (event: DraggingDateEvent | undefined) => void;
  scrollableRef: RefObject<HTMLDivElement>;
  mouseHistoryRef: MutableRefObject<MouseHistory | undefined>;
  eventCreationDragData: DragDateRange | undefined;
  onChangeEventCreationDragData: (range: DragDateRange | undefined) => void;
  onUpdateEvent: (event: Event) => void;
  resizingEventState: ResizingDateEventState | undefined;
  onChangeResizingEventState: (
    state: ResizingDateEventState | undefined,
  ) => void;
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  {
    currentDate,
    date,
    timedEvents,
    draggingEvent,
    onChangeDraggingEvent,
    scrollableRef,
    mouseHistoryRef,
    eventCreationDragData,
    onChangeEventCreationDragData,
    onUpdateEvent,
    resizingEventState,
    onChangeResizingEventState,
  },
  ref,
) {
  const columnRef = useRef<HTMLDivElement>(null);
  const dateEvents = getDateEvents({ date, events: timedEvents });

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
    const previewHeight = getHeightFromInterval(draggingEvent, date);

    let previewTop = mouseY - columnRect.y - draggingEvent.dragStartY;
    if (previewTop < 0) {
      previewTop = 0;
    }
    if (previewTop > columnRect.height - previewHeight) {
      previewTop = columnRect.height - previewHeight;
    }
    const gap = previewTop % EVENT_MIN_HEIGHT;
    previewTop = previewTop - gap;

    const startDate = getDateFromY(date, previewTop);
    const endDate = addMinutes(
      startDate,
      differenceInMinutes(draggingEvent.end, draggingEvent.start),
    );

    onChangeDraggingEvent({ ...draggingEvent, start: startDate, end: endDate });
  };

  const updateResizingEventState = (mouseY: number) => {
    if (!columnRef.current || !resizingEventState) {
      return;
    }

    const y = mouseY - columnRef.current.getBoundingClientRect().y;
    if (y < 0) {
      return;
    }

    const mouseOverDate = getDateFromY(date, y);

    const { origin: resizeOrigin, event: resizingEvent } = resizingEventState;

    switch (resizeOrigin) {
      case "eventStart": {
        if (isSameMinute(resizingEvent.start, mouseOverDate)) {
          return;
        }

        if (isBefore(mouseOverDate, resizingEvent.start)) {
          const updatedEvent = {
            ...resizingEvent,
            start: mouseOverDate,
            end: resizingEvent.start,
          };

          onUpdateEvent(updatedEvent);
          onChangeResizingEventState({
            event: updatedEvent,
            origin: "eventEnd",
          });
        } else {
          onUpdateEvent({ ...resizingEvent, end: mouseOverDate });
        }
        return;
      }
      case "eventEnd": {
        if (isSameMinute(resizingEvent.end, mouseOverDate)) {
          return;
        }

        if (isAfter(mouseOverDate, resizingEvent.end)) {
          const updatedEvent = { ...resizingEvent, end: mouseOverDate };

          onUpdateEvent(updatedEvent);
          onChangeResizingEventState({
            event: updatedEvent,
            origin: "eventStart",
          });
        } else {
          onUpdateEvent({ ...resizingEvent, start: mouseOverDate });
        }
        return;
      }
      default: {
        throw new Error(resizeOrigin satisfies never);
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

    if (resizingEventState) {
      updateResizingEventState(e.clientY);
    }
  };

  const dropPreviewRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    dateEvent: DateEvent,
  ) => {
    // dragImageがうまく設定できなかったので、DnD APIではなくマウスイベントで処理する
    event.preventDefault();

    const dateEventY = event.currentTarget.getBoundingClientRect().y;
    onChangeDraggingEvent({
      ...dateEvent,
      dragStartY: event.clientY - dateEventY,
    });
  };

  const isPreviewVisible = useMemo(() => {
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

          const isResizing = resizingEventState?.event.id === event.id;
          return (
            <DateEventCard
              key={event.id}
              displayedDate={date}
              event={event}
              onDragStart={handleDragStart}
              dragging={dragging}
              draggingOther={draggingEvent ? !dragging : false}
              onChangeResizingEventState={onChangeResizingEventState}
              isResizing={isResizing}
              isResizingOther={(resizingEventState && !isResizing) ?? false}
            />
          );
        })}
        <PreviewDateEventCard
          date={date}
          ref={dropPreviewRef}
          event={draggingEvent}
          visible={isPreviewVisible}
        />
      </div>
    </div>
  );
});
