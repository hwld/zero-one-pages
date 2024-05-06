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
import { DraggingDateEvent, Event, ResizingDateEventState } from "../type";
import { EVENT_MIN_HEIGHT, getDateFromY } from "./utils";
import { NavigationButton } from "../navigation-button";
import { DateColumn, MouseHistory } from "./date-column";
import { WeeklyCalendarDayHeader } from "./weekly-calendar-header";
import { DragDateRange } from "../utils";

export const WEEKLY_CALENDAR_GRID_COLS_CLASS = "grid-cols-[75px,repeat(7,1fr)]";

type Props = {
  currentDate: Date;
  events: Event[];
  onCreateEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
};

export const WeeklyCalendar: React.FC<Props> = ({
  currentDate,
  events,
  onCreateEvent,
  onUpdateEvent,
}) => {
  const [date, setDate] = useState(currentDate);
  const allDayEvents = events.filter((e) => e.allDay);
  const timedEvents = events.filter((e) => !e.allDay);

  const week = useMemo(() => {
    const start = startOfDay(startOfWeek(date));
    const end = startOfDay(endOfWeek(date));

    return eachDayOfInterval({ start, end });
  }, [date]);

  const [eventCreationDragData, setEventCreationDragData] = useState<
    DragDateRange | undefined
  >(undefined);

  // マウスイベントが発生したときのyとscrollableのscrollTipを保存する
  const mouseHistoryRef = useRef<MouseHistory | undefined>(undefined);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!eventCreationDragData || !mouseHistoryRef.current) {
      return;
    }

    const delta = e.currentTarget.scrollTop - mouseHistoryRef.current.scrollTop;
    const y = mouseHistoryRef.current.y + delta;

    setEventCreationDragData({
      ...eventCreationDragData,
      dragEndDate: getDateFromY(eventCreationDragData.dragEndDate, y),
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
      if (!eventCreationDragData || e.button !== 0) {
        return;
      }

      const dragStartDate = eventCreationDragData.dragStartDate;
      const dragEndDate = eventCreationDragData.dragEndDate;

      if (dragStartDate.getTime() !== dragEndDate.getTime()) {
        const minDate = min([dragStartDate, dragEndDate]);
        const maxDate = max([dragStartDate, dragEndDate]);

        onCreateEvent({
          id: crypto.randomUUID(),
          allDay: false,
          start: minDate,
          end: maxDate,
          title: "event",
        });
      }

      setEventCreationDragData(undefined);
      mouseHistoryRef.current = undefined;
    };

    document.addEventListener("mouseup", createEvent);
    return () => {
      document.removeEventListener("mouseup", createEvent);
    };
  }, [eventCreationDragData, onCreateEvent]);

  // dragOverでもドラッグしてるデータにアクセスしたいので、dataTransferではなくstateで管理する
  const [draggingEvent, setDraggingEvent] = useState<
    DraggingDateEvent | undefined
  >(undefined);

  useEffect(() => {
    const moveEvent = () => {
      if (!draggingEvent) {
        return;
      }

      onUpdateEvent(draggingEvent);
      setDraggingEvent(undefined);
    };

    document.addEventListener("mouseup", moveEvent);
    return () => {
      document.removeEventListener("mouseup", moveEvent);
    };
  }, [draggingEvent, onUpdateEvent]);

  const [resizingEventState, setResizingEventState] = useState<
    ResizingDateEventState | undefined
  >(undefined);

  useEffect(() => {
    const endResizeEvent = () => {
      if (resizingEventState) {
        setResizingEventState(undefined);
      }
    };

    document.addEventListener("mouseup", endResizeEvent);
    return () => {
      document.removeEventListener("mouseup", endResizeEvent);
    };
  }, [resizingEventState]);

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
          currentDate={currentDate}
          week={week}
          onCreateEvent={onCreateEvent}
          onUpdateEvent={onUpdateEvent}
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
                key={`${date}`}
                currentDate={currentDate}
                date={date}
                timedEvents={timedEvents}
                draggingEvent={draggingEvent}
                onChangeDraggingEvent={setDraggingEvent}
                eventCreationDragData={eventCreationDragData}
                onChangeEventCreationDragData={setEventCreationDragData}
                scrollableRef={scrollableRef}
                mouseHistoryRef={mouseHistoryRef}
                onUpdateEvent={onUpdateEvent}
                resizingEventState={resizingEventState}
                onChangeResizingEventState={setResizingEventState}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
