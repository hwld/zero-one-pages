import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import {
  AreIntervalsOverlappingOptions,
  Interval,
  areIntervalsOverlapping,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  isEqual,
  lastDayOfMonth,
  startOfWeek,
} from "date-fns";

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

  const isDragging = useRef(false);
  return (
    <div className="[&>div:last-child]:border-b">
      {calendar.map((week, i) => {
        return (
          <div
            key={i}
            className="relative grid select-none auto-rows-[180px] grid-cols-7 [&>div:last-child]:border-r"
          >
            <div className="pointer-events-none absolute bottom-0 left-0 top-6 grid w-full auto-rows-[20px] grid-cols-7 gap-1 py-2">
              {events
                .filter((event) => {
                  return areIntervalsOverlapping(
                    { start: week[0], end: week[week.length - 1] },
                    { start: event.start, end: event.end },
                    { inclusive: true },
                  );
                })
                .map((e) => {
                  const dates = getOverlappingDates(
                    { start: week[0], end: week[week.length - 1] },
                    { start: e.start, end: e.end },
                    { inclusive: true },
                  );
                  const firstWeek = dates[0].getDay();
                  const lastWeek = dates[dates.length - 1].getDay();
                  return (
                    <div
                      key={e.id}
                      className="col-start-[var(--col-start)] col-end-[var(--col-end)] flex items-center rounded bg-blue-500 px-1 text-sm text-neutral-100"
                      style={{
                        ["--col-start" as string]: firstWeek + 1,
                        ["--col-end" as string]: `span ${
                          lastWeek - firstWeek + 1
                        }`,
                      }}
                    >
                      {e.title}
                    </div>
                  );
                })}
              {/* <div className="col-span-3 col-start-3 bg-blue-500" /> */}
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

                    const minDateTime = Math.min(
                      dragState.startDate.getTime(),
                      dragState.endDate?.getTime() ?? Number.MAX_VALUE,
                    );
                    const maxDateTime = Math.max(
                      dragState.startDate.getTime(),
                      dragState.endDate?.getTime() ?? Number.MIN_VALUE,
                    );

                    setEvents((ss) => [
                      ...ss,
                      {
                        id: crypto.randomUUID(),
                        title: "event",
                        start: new Date(minDateTime),
                        end: new Date(maxDateTime),
                      },
                    ]);
                    setDragState({ startDate: undefined, endDate: undefined });
                    isDragging.current = false;
                  }}
                >
                  <div className="p-2">{day}</div>
                  <div></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
