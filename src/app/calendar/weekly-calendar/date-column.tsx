import {
  addMinutes,
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  isSameDay,
  max,
  min,
  startOfDay,
} from "date-fns";
import { DateEventColumn } from "./date-event-column";
import { NewEvent } from "./new-event";
import {
  EVENT_MIN_HEIGHT,
  EVENT_MIN_MINUTES,
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
  useState,
} from "react";
import { DateEvent, DraggingDateEvent, Event } from "../type";
import { PreviewDateEventCard } from "./date-event-card";

export type MouseHistory = { y: number; scrollTop: number };

export type DragDateState = {
  targetDate: Date;
  startDate: Date;
  endDate: Date;
};

type Props = {
  date: Date;
  events: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onDraggingEventChange: (event: DraggingDateEvent | undefined) => void;
  dragState: DragDateState | undefined;
  scrollableRef: RefObject<HTMLDivElement>;
  mouseHistoryRef: MutableRefObject<MouseHistory | undefined>;
  onDragStateChange: (state: DragDateState | undefined) => void;
  onCreateEvent: (event: Event) => void;
  onEventUpdate: (event: Event) => void;
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  {
    date,
    events,
    draggingEvent,
    onDraggingEventChange,
    scrollableRef,
    mouseHistoryRef,
    dragState,
    onDragStateChange,
    onCreateEvent,
    onEventUpdate,
  },
  ref,
) {
  const columnRef = useRef<HTMLDivElement>(null);

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

    if (!columnRef.current || !scrollableRef.current) {
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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!dragState || !columnRef.current || !scrollableRef.current) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = e.clientY - columnY;

    mouseHistoryRef.current = {
      y,
      scrollTop: scrollableRef.current.scrollTop,
    };
    onDragStateChange({
      ...dragState,
      endDate: getDateFromY(dragState.targetDate, y),
    });
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!dragState) {
      return;
    }

    const startDate = dragState.startDate;
    const endDate = dragState.endDate;

    if (startDate.getTime() === endDate.getTime()) {
      onDragStateChange(undefined);
      return;
    }

    const minDate = min([startDate, endDate]);
    const maxDate = max([startDate, endDate]);

    onCreateEvent({
      id: crypto.randomUUID(),
      start: minDate,
      end: maxDate,
      title: "event",
    });
    onDragStateChange(undefined);
    mouseHistoryRef.current = undefined;
  };

  const dropPreviewRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    dateEvent: DateEvent,
  ) => {
    if (!dropPreviewRef.current) {
      return;
    }

    event.dataTransfer.setDragImage(dropPreviewRef.current, 0, 0);
    event.dataTransfer.effectAllowed = "move";

    const dateEventY = event.currentTarget.getBoundingClientRect().y;
    onDraggingEventChange({
      ...dateEvent,
      dragStartY: event.clientY - dateEventY,
    });
  };

  const handleDragEnd = () => {
    onDraggingEventChange(undefined);
  };

  const [dropPreviewEventPart, setDropPreviewEventPart] = useState<
    | {
        top: string;
        height: string;
        start: Date;
        end: Date;
      }
    | undefined
  >(undefined);
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingEvent || !dropPreviewRef.current || !columnRef.current) {
      return;
    }

    setIsDragOver(true);
    const columnRect = columnRef.current.getBoundingClientRect();
    const previewHeight = getHeightFromDate(draggingEvent);

    let previewTop = e.clientY - columnRect.y - draggingEvent.dragStartY;
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

    setDropPreviewEventPart({
      top: `${previewTop}px`,
      height: `${previewHeight}px`,
      start: startDate,
      end: endDate,
    });
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = () => {
    if (!draggingEvent) {
      return;
    }

    onEventUpdate({
      ...draggingEvent,
      start: dropPreviewEventPart?.start ?? draggingEvent.start,
      end: dropPreviewEventPart?.end ?? draggingEvent.end,
    });

    setIsDragOver(false);
    onDraggingEventChange(undefined);
  };

  const previewEvent = useMemo((): DateEvent | undefined => {
    if (!draggingEvent) {
      return undefined;
    }

    const start = dropPreviewEventPart
      ? dropPreviewEventPart.start
      : draggingEvent.start;

    const end = dropPreviewEventPart
      ? dropPreviewEventPart.end
      : draggingEvent.end;

    return { ...draggingEvent, start, end };
  }, [draggingEvent, dropPreviewEventPart]);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <div
        ref={columnRef}
        className="relative border-r border-neutral-300"
        style={{ height: EVENT_MIN_HEIGHT * 4 * 24 }}
        draggable={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
        {dragState && isSameDay(date, dragState.targetDate) && (
          <NewEvent data={dragState} />
        )}
        <DateEventColumn
          dateColumnRef={columnRef}
          date={date}
          events={events}
          draggingEvent={draggingEvent}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onEventUpdate={onEventUpdate}
        />
        <PreviewDateEventCard
          ref={dropPreviewRef}
          event={previewEvent}
          visible={isDragOver}
          top={dropPreviewEventPart?.top}
          height={dropPreviewEventPart?.height}
        />
      </div>
    </div>
  );
});
