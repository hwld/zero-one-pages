import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
  format,
  addDays,
  subDays,
} from "date-fns";
import { useMemo, useRef, useState } from "react";
import { DraggingDateEvent, Event } from "../type";
import { EVENT_MIN_HEIGHT, getDateFromY } from "./utils";
import { NavigationButton } from "../navigation-button";
import { DateColumn, DragDateState, MouseHistory } from "./date-column";
import { WeeklyCalendarDayHeader } from "./weekly-calendar-header";

export const WEEKLY_CALENDAR_GRID_COLS_CLASS = "grid-cols-[75px,repeat(7,1fr)]";

export const WeeklyCalendar: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const allDayEvents = events.filter((e) => e.allDay);
  const timedEvents = events.filter((e) => !e.allDay);

  const week = useMemo(() => {
    const start = startOfDay(startOfWeek(date));
    const end = startOfDay(endOfWeek(date));

    return eachDayOfInterval({ start, end });
  }, [date]);

  const [dragState, setDragState] = useState<DragDateState | undefined>(
    undefined,
  );

  // dragOverでもドラッグしてるデータにアクセスしたいので、dataTransferではなくstateで管理する
  const [draggingEvent, setDraggingEvent] = useState<
    DraggingDateEvent | undefined
  >(undefined);

  // マウスイベントが発生したときのyとscrollableのscrollTipを保存する
  const mouseHistoryRef = useRef<MouseHistory | undefined>(undefined);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!dragState || !mouseHistoryRef.current) {
      return;
    }

    const delta = e.currentTarget.scrollTop - mouseHistoryRef.current.scrollTop;
    const y = mouseHistoryRef.current.y + delta;

    setDragState({
      ...dragState,
      endDate: getDateFromY(dragState.targetDate, y),
    });
  };

  const handleCreateEvent = (event: Event) => {
    setEvents((e) => [...e, event]);
  };

  const handleEventUpdate = (event: Event) => {
    setEvents((events) =>
      events.map((e) => {
        if (e.id === event.id) {
          return event;
        }
        return e;
      }),
    );
  };

  const handleNextWeek = () => {
    setDate(addDays(endOfWeek(date), 1));
  };

  const handlePrevWeek = () => {
    setDate(subDays(startOfWeek(date), 1));
  };

  const scrollableRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <NavigationButton dir="prev" onClick={handlePrevWeek} />
        <div className="flex select-none items-center">
          <div className="mx-1 text-lg tabular-nums">{date.getFullYear()}</div>
          年
          <div className="mx-1 w-6 text-center text-lg tabular-nums">
            {date.getMonth() + 1}
          </div>
          月
        </div>
        <NavigationButton dir="next" onClick={handleNextWeek} />
      </div>

      <div
        className="flex w-full flex-col overflow-auto"
        ref={scrollableRef}
        onScroll={handleScroll}
      >
        <WeeklyCalendarDayHeader
          week={week}
          onCreateEvent={handleCreateEvent}
          allDayEvents={allDayEvents}
        />

        <div className="grid grid-cols-[75px,repeat(7,1fr)]">
          <div className="mr-2">
            {eachHourOfInterval({
              start: startOfDay(date),
              end: endOfDay(date),
            }).map((h, i) => {
              return (
                <div
                  className="relative select-none whitespace-nowrap tabular-nums text-neutral-400"
                  key={i}
                  style={{
                    height: EVENT_MIN_HEIGHT * 4,
                    top: i !== 0 ? "-6px" : undefined,
                    fontSize: "12px",
                  }}
                >
                  {format(h, "hh:mm a")}
                </div>
              );
            })}
          </div>
          {week.map((date) => {
            return (
              <DateColumn
                date={date}
                timedEvents={timedEvents}
                draggingEvent={draggingEvent}
                onDraggingEventChange={setDraggingEvent}
                dragState={dragState}
                onDragStateChange={setDragState}
                scrollableRef={scrollableRef}
                mouseHistoryRef={mouseHistoryRef}
                onCreateEvent={handleCreateEvent}
                onEventUpdate={handleEventUpdate}
                key={`${date}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
