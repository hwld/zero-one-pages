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
import { MINUTES_15_HEIGHT, getDateFromY, getHeightFromDate } from "./utils";
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
import clsx from "clsx";
import { DateEventCard } from "./date-event";

export type MouseHistory = { y: number; scrollTop: number };

export type DragDateState = {
  targetDate: Date;
  dragStartY: number;
  dragEndY: number;
};

type Props = {
  date: Date;
  events: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onEventDragStart: (
    e: DragEvent<HTMLDivElement>,
    dateEvent: DateEvent,
  ) => void;
  onEventDragEnd: () => void;
  dragState: DragDateState | undefined;
  scrollableRef: RefObject<HTMLDivElement>;
  mouseHistoryRef: MutableRefObject<MouseHistory | undefined>;
  onDragStateChange: (state: DragDateState | undefined) => void;
  onCreateEvent: (event: Event) => void;
};
export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  {
    date,
    events,
    draggingEvent,
    onEventDragEnd,
    onEventDragStart,
    scrollableRef,
    mouseHistoryRef,
    dragState,
    onDragStateChange,
    onCreateEvent,
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
    onDragStateChange({
      targetDate: startOfDay(date),
      dragStartY: y,
      dragEndY: y + MINUTES_15_HEIGHT,
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
    onDragStateChange({ ...dragState, dragEndY: y });
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!dragState) {
      return;
    }

    const startDate = getDateFromY(dragState.targetDate, dragState.dragStartY);
    const endDate = getDateFromY(dragState.targetDate, dragState.dragEndY);

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
    const gap = previewTop % MINUTES_15_HEIGHT;
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
    setIsDragOver(false);
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
        style={{ height: MINUTES_15_HEIGHT * 4 * 24 }}
        draggable={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hours.map((hour, i) => {
          return (
            <div
              key={`${hour}`}
              className="absolute h-[1px] w-full bg-neutral-300"
              style={{ top: MINUTES_15_HEIGHT * 4 * i }}
            />
          );
        })}
        {dragState && isSameDay(date, dragState.targetDate) && (
          <NewEvent data={dragState} />
        )}
        <DateEventColumn
          date={date}
          events={events}
          draggingEvent={draggingEvent}
          onDragStart={(e, dateEvent) => {
            if (!dropPreviewRef.current) {
              return;
            }

            e.dataTransfer.setDragImage(dropPreviewRef.current, 0, 0);
            onEventDragStart(e, dateEvent);
          }}
          onDragEnd={onEventDragEnd}
        />
        <DateEventCard
          ref={dropPreviewRef}
          event={previewEvent}
          className={clsx(
            "pointer-events-none z-20 w-full",
            isDragOver ? "opacity-100" : "opacity-0",
          )}
          style={{
            top: dropPreviewEventPart?.top,
            height: dropPreviewEventPart?.height,
          }}
        />
      </div>
    </div>
  );
});
