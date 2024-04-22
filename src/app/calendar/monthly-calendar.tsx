import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreIntervalsOverlappingOptions,
  Interval,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  isEqual,
  isWithinInterval,
  lastDayOfMonth,
  startOfWeek,
} from "date-fns";
import { EVENT_ROW_SIZE } from "./consts";

const getCalendarDates = ({
  year,
  month: _month,
}: {
  year: number;
  month: number;
}): Date[][] => {
  const month = _month - 1;
  const firstDay = new Date(year, month, 1);
  const lastDay = lastDayOfMonth(new Date(year, month));

  // 7日ごとに日付をまとめる
  const calendarWeekStarts = eachWeekOfInterval({
    start: startOfWeek(firstDay),
    end: endOfWeek(lastDay),
  });
  const calendar = calendarWeekStarts.map((weekStart) => {
    return eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart) });
  });

  return calendar;
};

const getOverlappingDates = (
  a: Interval,
  b: Interval,
  options?: AreIntervalsOverlappingOptions,
) => {
  if (areIntervalsOverlapping(a, b, options)) {
    const start = a.start > b.start ? a.start : b.start;
    const end = a.end < b.end ? a.end : b.end;
    return eachDayOfInterval({ start, end });
  } else {
    return [];
  }
};

type DragDateRange = { startDate: Date | undefined; endDate: Date | undefined };

const inDragDateRange = (value: Date, range: DragDateRange) => {
  if (range.startDate === undefined && range.endDate === undefined) {
    return false;
  }

  // どっちかがundefinedであれば同じ日付か比較する
  if (range.startDate === undefined && range.endDate !== undefined) {
    return isEqual(value, range.endDate);
  }

  if (range.startDate !== undefined && range.endDate === undefined) {
    return isEqual(value, range.startDate);
  }

  if (range.startDate === undefined || range.endDate === undefined) {
    throw new Error("");
  }

  const startDateTime = range.startDate.getTime();
  const endDateTime = range.endDate.getTime();
  const valueTime = value.getTime();

  const min = Math.min(startDateTime, endDateTime);
  const max = Math.max(startDateTime, endDateTime);
  return valueTime >= min && valueTime <= max;
};

type Event = { id: string; title: string; start: Date; end: Date };

export const MonthlyCalendar: React.FC = () => {
  const year = 2024;
  const month = 4;
  const calendar = useMemo(() => {
    return getCalendarDates({ year, month });
  }, []);

  const [events, setEvents] = useState<Event[]>([]);

  const [dragState, setDragState] = useState<DragDateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const firstEventSpaceRef = useRef<HTMLDivElement>(null);
  const [rowLimit, setRowLimit] = useState(0);

  useEffect(() => {
    const eventSpace = firstEventSpaceRef.current;
    const measure = () => {
      if (!eventSpace) {
        return;
      }
      const eventSpaceHeight = eventSpace.getBoundingClientRect().height;
      // read moreを表示するため、-1する
      const rowLimit = Math.floor(eventSpaceHeight / EVENT_ROW_SIZE) - 1;
      setRowLimit(rowLimit);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("reset", measure);
    };
  }, []);

  const isDragging = useRef(false);
  return (
    <div className="grid h-full w-full flex-col [&>div:last-child]:border-b">
      {calendar.map((week, i) => {
        const weekEvents = events
          .filter((event) => {
            const overlapping = areIntervalsOverlapping(
              { start: week[0], end: week[week.length - 1] },
              { start: event.start, end: event.end },
              { inclusive: true },
            );

            return overlapping;
          })
          .sort((event1, event2) => {
            const startTime1 = event1.start.getTime();
            const startTime2 = event2.start.getTime();
            if (startTime1 < startTime2) {
              return -1;
            }
            if (startTime2 > startTime1) {
              return 1;
            }

            const range1 = differenceInCalendarDays(event1.end, event1.start);
            const range2 = differenceInCalendarDays(event2.end, event2.start);
            if (range1 > range2) {
              return -1;
            }
            if (range2 > range1) {
              return 1;
            }

            return 0;
          });

        const weekEventsWithTop: (Event & { top: number })[] = [];
        for (let i = 0; i < weekEvents.length; i++) {
          const event = weekEvents[i];

          // イベントよりも前に存在している重複したイベントを取得する
          const prevOverlappingEvents = weekEventsWithTop.filter(
            (prevEvent, index) => {
              const overlapping = areIntervalsOverlapping(event, prevEvent, {
                inclusive: true,
              });
              return overlapping && index < i;
            },
          );

          // 使用されているtopを取得する
          const dates = eachDayOfInterval(event);
          const invalidTops = dates.flatMap((date) => {
            return prevOverlappingEvents
              .map((prevEvent) => {
                if (isWithinInterval(date, prevEvent)) {
                  return prevEvent.top;
                }
                return undefined;
              })
              .filter((top): top is number => top !== undefined);
          });
          const invalidTopSet = new Set(invalidTops);

          // topを求める
          let top = 0;
          for (let i = 0; i < Number.MAX_VALUE; i++) {
            if (!invalidTopSet.has(i)) {
              top = i;
              break;
            }
          }

          weekEventsWithTop.push({ ...event, top });
        }

        const overLimitCountByWeekDay = weekEventsWithTop
          .filter((event) => event.top >= rowLimit)
          .flatMap((event) => {
            return eachDayOfInterval(event);
          })
          .reduce((map, date) => {
            const weekDay = date.getDay();
            const overLimitEventCount = map.get(weekDay);

            if (overLimitEventCount !== undefined) {
              map.set(weekDay, overLimitEventCount + 1);
            } else {
              map.set(weekDay, 1);
            }
            return map;
          }, new Map<number, number>());

        return (
          <div
            key={i}
            className="relative grid min-h-[80px] min-w-[560px] select-none grid-cols-7 [&>div:last-child]:border-r"
          >
            <div
              ref={i === 0 ? firstEventSpaceRef : undefined}
              className="pointer-events-none absolute bottom-0 left-0 top-6 mt-2 w-full gap-1"
            >
              {weekEventsWithTop
                .filter((event) => event.top < rowLimit)
                .map((event) => {
                  const dates = getOverlappingDates(
                    { start: week[0], end: week[week.length - 1] },
                    { start: event.start, end: event.end },
                    { inclusive: true },
                  );
                  const startWeekDay = dates[0].getDay();
                  const endWeekDay = dates[dates.length - 1].getDay();

                  return (
                    <div
                      key={event.id}
                      className="absolute pb-[1px] text-sm text-neutral-100"
                      style={{
                        height: `${EVENT_ROW_SIZE}px`,
                        width: `calc(100% / 7  * ${
                          endWeekDay - startWeekDay + 1
                        } - 10px)`,
                        top: `calc(${EVENT_ROW_SIZE}px * ${event.top})`,
                        left: `calc(100% / 7 * ${startWeekDay})`,
                      }}
                    >
                      <div className="flex h-full w-full items-center rounded bg-neutral-700 px-1">
                        {event.title}
                      </div>
                    </div>
                  );
                })}
              {week.map((date) => {
                const weekDay = date.getDay();
                const count = overLimitCountByWeekDay.get(weekDay);

                if (!count) {
                  return null;
                }

                return (
                  <div
                    key={weekDay}
                    className="absolute"
                    style={{
                      height: `${EVENT_ROW_SIZE}px`,
                      width: `calc(100% / 7 - 10px)`,
                      top: `calc(${EVENT_ROW_SIZE}px * ${rowLimit})`,
                      left: `calc(100% / 7 * ${weekDay})`,
                    }}
                  >
                    <div className="flex h-full w-full items-center rounded px-1 text-xs text-neutral-700">
                      他<span className="mx-1">{count}</span>件
                    </div>
                  </div>
                );
              })}
            </div>
            {week.map((date) => {
              const day = date.getDate();

              return (
                <div
                  key={day}
                  className={clsx(
                    "select-none border-l border-t text-xs text-neutral-700",
                    inDragDateRange(date, dragState) ? "bg-blue-500/20" : "",
                  )}
                  onMouseOver={() => {
                    if (isDragging.current) {
                      setDragState((s) => ({ ...s, endDate: date }));
                    }
                  }}
                  onMouseDown={() => {
                    setDragState({ startDate: date, endDate: undefined });
                    isDragging.current = true;
                  }}
                  onMouseUp={() => {
                    if (
                      dragState.startDate === undefined &&
                      dragState.endDate
                    ) {
                      return;
                    }
                    if (dragState.startDate === undefined) {
                      return;
                    }

                    const eventStart = new Date(
                      Math.min(
                        dragState.startDate.getTime(),
                        dragState.endDate?.getTime() ?? Number.MAX_VALUE,
                      ),
                    );
                    const eventEnd = new Date(
                      Math.max(
                        dragState.startDate.getTime(),
                        dragState.endDate?.getTime() ?? Number.MIN_VALUE,
                      ),
                    );

                    setEvents((ss) => [
                      ...ss,
                      {
                        id: crypto.randomUUID(),
                        title: `event ${ss.length + 1}`,
                        start: eventStart,
                        end: eventEnd,
                      },
                    ]);
                    setDragState({ startDate: undefined, endDate: undefined });
                    isDragging.current = false;
                  }}
                >
                  <div className="p-2">{day}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
