import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  isSameDay,
  max,
  min,
  startOfDay,
  startOfWeek,
  format,
} from "date-fns";
import { useMemo, useRef, useState } from "react";
import { Event } from "../type";
import { NewEvent } from "./new-event";
import { MINUTES_15_HEIGHT, getDateFromY } from "./utils";
import { DateEventColumn } from "./date-event-column";
import { WEEK_DAY_LABELS } from "../consts";

export type DragState = {
  targetDate: Date;
  dragStartY: number;
  dragEndY: number;
};

export const WeeklyCalendar: React.FC = () => {
  const [date] = useState(new Date());

  const [events, setEvents] = useState<Event[]>([]);

  const week = useMemo(() => {
    const start = startOfDay(startOfWeek(date));
    const end = startOfDay(endOfWeek(date));

    return eachDayOfInterval({ start, end });
  }, [date]);

  const [dragState, setDragState] = useState<DragState | undefined>(undefined);

  const mouseRef = useRef<{ y: number; scrollTop: number } | undefined>(
    undefined,
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!dragState || !mouseRef.current) {
      return;
    }

    const delta = e.currentTarget.scrollTop - mouseRef.current.scrollTop;
    const y = mouseRef.current.y + delta;

    setDragState({ ...dragState, dragEndY: y });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const firstDateColumnRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="flex w-full gap-2 overflow-auto"
      ref={containerRef}
      onScroll={handleScroll}
    >
      <div>
        <div className="h-5"></div>
        {eachHourOfInterval({
          start: startOfDay(date),
          end: endOfDay(date),
        }).map((h, i) => {
          return (
            <div
              className="whitespace-nowrap text-xs tabular-nums text-neutral-400"
              key={i}
              style={{ height: MINUTES_15_HEIGHT * 4 }}
            >
              {format(h, "hh:mm a")}
            </div>
          );
        })}
      </div>
      <div className="grid w-full grid-cols-7 bg-neutral-100">
        {week.map((date, i) => {
          const hours = eachHourOfInterval({
            start: startOfDay(date),
            end: endOfDay(date),
          });

          return (
            <div key={`${date}`} className="flex flex-col gap-2">
              <div className="flex h-5 select-none items-center justify-center gap-1 text-xs">
                <div>{WEEK_DAY_LABELS[date.getDay()]}</div>
                <div>{date.getDate()}</div>
              </div>
              <div
                ref={i === 0 ? firstDateColumnRef : undefined}
                className="relative border-r border-neutral-300"
                style={{ height: MINUTES_15_HEIGHT * 4 * 24 }}
                draggable={false}
                onMouseDown={(e) => {
                  if (!firstDateColumnRef.current || !containerRef.current) {
                    return;
                  }
                  const columnY =
                    firstDateColumnRef.current.getBoundingClientRect().y;
                  const y = e.clientY - columnY;

                  mouseRef.current = {
                    y,
                    scrollTop: containerRef.current.scrollTop,
                  };
                  setDragState({
                    targetDate: startOfDay(date),
                    dragStartY: y,
                    dragEndY: y + MINUTES_15_HEIGHT,
                  });
                }}
                onMouseMove={(e) => {
                  if (
                    !dragState ||
                    !firstDateColumnRef.current ||
                    !containerRef.current
                  ) {
                    return;
                  }

                  const columnY =
                    firstDateColumnRef.current.getBoundingClientRect().y;
                  const y = e.clientY - columnY;

                  mouseRef.current = {
                    y,
                    scrollTop: containerRef.current.scrollTop,
                  };
                  setDragState({ ...dragState, dragEndY: y });
                }}
                onMouseUp={() => {
                  if (!dragState) {
                    return;
                  }

                  const startDate = getDateFromY(
                    dragState.targetDate,
                    dragState.dragStartY,
                  );

                  const endDate = getDateFromY(
                    dragState.targetDate,
                    dragState.dragEndY,
                  );

                  if (startDate.getTime() === endDate.getTime()) {
                    setDragState(undefined);
                    return;
                  }

                  const minDate = min([startDate, endDate]);
                  const maxDate = max([startDate, endDate]);

                  setEvents((e) => [
                    ...e,
                    {
                      id: crypto.randomUUID(),
                      start: minDate,
                      end: maxDate,
                      title: "",
                    },
                  ]);
                  setDragState(undefined);
                  mouseRef.current = undefined;
                }}
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
        })}
      </div>
    </div>
  );
};
