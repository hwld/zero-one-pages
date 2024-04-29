import {
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
import { DraggingDateEvent, Event } from "../type";
import clsx from "clsx";

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
  onDraggingEventChange: (event: DraggingDateEvent | undefined) => void;
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
    onDraggingEventChange,
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

  const handleEventDragStart = (dateEvent: DraggingDateEvent) => {
    onDraggingEventChange(dateEvent);
  };

  const handleEventDragEnd = () => {
    onDraggingEventChange(undefined);
  };

  const dropPreviewRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingEvent || !dropPreviewRef.current || !columnRef.current) {
      return;
    }

    setIsDragOver(true);
    const columnRect = columnRef.current.getBoundingClientRect();
    console.log(draggingEvent);
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

    dropPreviewRef.current.style.height = `${previewHeight}px`;
    dropPreviewRef.current.style.top = `${previewTop}px`;
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = () => {
    console.log(draggingEvent);
    setIsDragOver(false);
  };

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
          onDragStart={handleEventDragStart}
          onDragEnd={handleEventDragEnd}
        />
        <div
          ref={dropPreviewRef}
          className={clsx(
            "absolute left-0 w-full rounded border-2 border-neutral-500",
            isDragOver ? "block" : "hidden",
          )}
        />
      </div>
    </div>
  );
});
