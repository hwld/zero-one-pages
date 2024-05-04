import {
  addMinutes,
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
  getHeightFromDate,
} from "./utils";
import {
  DragEvent,
  MouseEvent,
  MutableRefObject,
  RefObject,
  forwardRef,
  useMemo,
  useRef,
} from "react";
import { DateEvent, DraggingDateEvent, Event } from "../type";
import { DateEventCard, PreviewDateEventCard } from "./date-event-card";

export type MouseHistory = { y: number; scrollTop: number };

export type DragDateState = {
  targetDate: Date;
  startDate: Date;
  endDate: Date;
};

type Props = {
  currentDate: Date;
  date: Date;
  timedEvents: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onDraggingEventChange: (event: DraggingDateEvent | undefined) => void;
  dragState: DragDateState | undefined;
  scrollableRef: RefObject<HTMLDivElement>;
  mouseHistoryRef: MutableRefObject<MouseHistory | undefined>;
  onDragStateChange: (state: DragDateState | undefined) => void;
  onUpdateEvent: (event: Event) => void;
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  {
    currentDate,
    date,
    timedEvents,
    draggingEvent,
    onDraggingEventChange,
    scrollableRef,
    mouseHistoryRef,
    dragState,
    onDragStateChange,
    onUpdateEvent,
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

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
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
    const startDate = getDateFromY(targetDate, y, "floor");
    const endDate = addMinutes(startDate, EVENT_MIN_MINUTES);

    onDragStateChange({
      targetDate,
      startDate,
      endDate,
    });
  };

  const updateDragState = (mouseY: number) => {
    if (!dragState || !columnRef.current || !scrollableRef.current) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = mouseY - columnY;

    mouseHistoryRef.current = {
      y,
      scrollTop: scrollableRef.current.scrollTop,
    };
    onDragStateChange({
      ...dragState,
      endDate: getDateFromY(dragState.targetDate, y),
    });
  };

  const updateDraggingEvent = (mouseY: number) => {
    if (!draggingEvent || !dropPreviewRef.current || !columnRef.current) {
      return;
    }

    const columnRect = columnRef.current.getBoundingClientRect();
    const previewHeight = getHeightFromDate(draggingEvent);

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

    onDraggingEventChange({ ...draggingEvent, start: startDate, end: endDate });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (dragState) {
      updateDragState(e.clientY);
    }

    if (draggingEvent) {
      updateDraggingEvent(e.clientY);
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
    onDraggingEventChange({
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
      { inclusive: true },
    );
  }, [date, draggingEvent]);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <div
        ref={columnRef}
        className="relative border-r border-neutral-300"
        style={{ height: EVENT_MIN_HEIGHT * 4 * 24 }}
        draggable={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
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
        {dragState && isSameDay(date, dragState.targetDate) && (
          <NewEvent data={dragState} />
        )}
        {dateEvents.map((event) => {
          const dragging = event.id === draggingEvent?.id;

          return (
            <DateEventCard
              dateColumnRef={columnRef}
              key={event.id}
              event={event}
              onDragStart={handleDragStart}
              onEventUpdate={onUpdateEvent}
              dragging={dragging}
              draggingOther={draggingEvent ? !dragging : false}
            />
          );
        })}
        <PreviewDateEventCard
          ref={dropPreviewRef}
          event={draggingEvent}
          visible={isPreviewVisible}
        />
      </div>
    </div>
  );
});
