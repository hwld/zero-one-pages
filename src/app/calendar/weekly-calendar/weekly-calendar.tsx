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
  min,
  max,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { DraggingDateEvent, Event } from "../type";
import { EVENT_MIN_HEIGHT, getDateFromY } from "./utils";
import { NavigationButton } from "../navigation-button";
import { DateColumn, DragDateState, MouseHistory } from "./date-column";
import { WeeklyCalendarDayHeader } from "./weekly-calendar-header";

export const WEEKLY_CALENDAR_GRID_COLS_CLASS = "grid-cols-[75px,repeat(7,1fr)]";

type Props = {
  events: Event[];
  onCreateEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
};

export const WeeklyCalendar: React.FC<Props> = ({
  events,
  onCreateEvent,
  onUpdateEvent,
}) => {
  const [date, setDate] = useState(new Date());
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

  const handleNextWeek = () => {
    setDate(addDays(endOfWeek(date), 1));
  };

  const handlePrevWeek = () => {
    setDate(subDays(startOfWeek(date), 1));
  };

  useEffect(() => {
    const createEvent = (e: MouseEvent) => {
      if (!dragState || e.button !== 0) {
        return;
      }

      const startDate = dragState.startDate;
      const endDate = dragState.endDate;

      if (startDate.getTime() !== endDate.getTime()) {
        const minDate = min([startDate, endDate]);
        const maxDate = max([startDate, endDate]);

        onCreateEvent({
          id: crypto.randomUUID(),
          allDay: false,
          start: minDate,
          end: maxDate,
          title: "event",
        });
      }

      setDragState(undefined);
      mouseHistoryRef.current = undefined;
    };

    document.addEventListener("mouseup", createEvent);
    return () => {
      document.removeEventListener("mouseup", createEvent);
    };
  }, [dragState, onCreateEvent]);

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
          onCreateEvent={onCreateEvent}
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
                onUpdateEvent={onUpdateEvent}
                key={`${date}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
