import {
  addMinutes,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  isSameDay,
  max,
  min,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { useMemo, useRef, useState } from "react";
import { Event } from "../type";
import { NewEvent } from "./new-event";

export const minutes15Height = 12;

export type DragState = { dragStart: Date; dragEnd: Date };

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
    const minutes = Math.ceil(y / minutes15Height) * 15;
    const dragEnd = addMinutes(startOfDay(dragState.dragStart), minutes);

    setDragState({ ...dragState, dragEnd });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const firstDateColumnRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="grid grid-cols-7 overflow-auto bg-neutral-100"
      onScroll={handleScroll}
    >
      {week.map((date, i) => {
        const hours = eachHourOfInterval({
          start: startOfDay(date),
          end: endOfDay(date),
        });
        return (
          <div
            ref={i === 0 ? firstDateColumnRef : undefined}
            key={`${date}`}
            className="relative border-r border-neutral-300"
            style={{ height: minutes15Height * 4 * 24 }}
            draggable={false}
            onMouseDown={(e) => {
              if (!firstDateColumnRef.current || !containerRef.current) {
                return;
              }
              const columnY =
                firstDateColumnRef.current.getBoundingClientRect().y;
              const y = e.clientY - columnY;

              const start = addMinutes(
                date,
                Math.floor(y / minutes15Height) * 15,
              );

              mouseRef.current = {
                y,
                scrollTop: containerRef.current.scrollTop,
              };
              setDragState({
                dragStart: start,
                dragEnd: addMinutes(start, 15),
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
              const minutes = Math.ceil(y / minutes15Height) * 15;

              const dragEnd = addMinutes(
                startOfDay(dragState.dragStart),
                minutes,
              );

              mouseRef.current = {
                y,
                scrollTop: containerRef.current.scrollTop,
              };
              setDragState({ ...dragState, dragEnd });
            }}
            onMouseUp={() => {
              if (!dragState) {
                return;
              }

              if (
                dragState.dragStart.getTime() === dragState.dragEnd.getTime()
              ) {
                setDragState(undefined);
                return;
              }

              const minDate = min([dragState.dragStart, dragState.dragEnd]);
              const maxDate = max([dragState.dragStart, dragState.dragEnd]);

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
                  style={{ top: minutes15Height * 4 * i }}
                />
              );
            })}
            {dragState && isSameDay(date, dragState.dragStart) && (
              <NewEvent data={dragState} />
            )}
            {events.map((event) => {
              if (!isSameDay(date, event.start)) {
                return null;
              }

              const top =
                Math.floor(
                  (event.start.getHours() * 60 + event.start.getMinutes()) / 15,
                ) * minutes15Height;

              const height =
                Math.ceil(differenceInMinutes(event.end, event.start) / 15) *
                minutes15Height;

              return (
                <div
                  key={event.id}
                  className="absolute w-full bg-neutral-200"
                  style={{ top, height }}
                >
                  {event.title}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
