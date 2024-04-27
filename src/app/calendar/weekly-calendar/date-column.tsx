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
import { MINUTES_15_HEIGHT, getDateFromY } from "./utils";
import {
  MouseEvent,
  MutableRefObject,
  RefObject,
  forwardRef,
  useMemo,
  useRef,
} from "react";
import { Event } from "../type";

export type MouseHistory = { y: number; scrollTop: number };

export type DragDateState = {
  targetDate: Date;
  dragStartY: number;
  dragEndY: number;
};

type Props = {
  date: Date;
  events: Event[];
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
      title: "",
    });
    onDragStateChange(undefined);
    mouseHistoryRef.current = undefined;
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
        <DateEventColumn date={date} events={events} />
      </div>
    </div>
  );
});
