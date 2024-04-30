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
import { MINUTES_15_HEIGHT } from "./utils";
import { NavigationButton } from "../navigation-button";
import { DateColumn, DragDateState, MouseHistory } from "./date-column";
import { WEEK_DAY_LABELS } from "../consts";

export const WeeklyCalendar: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

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

    setDragState({ ...dragState, dragEndY: y });
  };

  const handleCreateEvent = (event: Event) => {
    setEvents((e) => [...e, event]);
  };

  const handleUpdateEvent = (event: Event) => {
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
        className="flex w-full gap-2 overflow-auto"
        ref={scrollableRef}
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
                className="select-none whitespace-nowrap text-xs tabular-nums text-neutral-400"
                key={i}
                style={{ height: MINUTES_15_HEIGHT * 4 }}
              >
                {format(h, "hh:mm a")}
              </div>
            );
          })}
        </div>
        <div className="grid w-full grid-cols-7 bg-neutral-100">
          {/* select-noneをつけてもDnDで日数が選択され、特定の拡張機能が動いてしまうことがあるため、緩和策としてDateColumnの外に出す*/}
          {/* 参考: 
                https://issues.chromium.org/issues/40728610) 
                https://developer.mozilla.org/ja/docs/Web/CSS/user-select#none
          */}
          {week.map((date) => {
            return (
              <div
                key={`${date}`}
                className="mb-2 flex h-5 select-none items-center justify-center gap-1 text-xs"
              >
                <div>{WEEK_DAY_LABELS[date.getDay()]}</div>
                <div>{date.getDate()}</div>
              </div>
            );
          })}
          {week.map((date) => {
            return (
              <DateColumn
                date={date}
                events={events}
                draggingEvent={draggingEvent}
                onDraggingEventChange={setDraggingEvent}
                dragState={dragState}
                onDragStateChange={setDragState}
                scrollableRef={scrollableRef}
                mouseHistoryRef={mouseHistoryRef}
                onCreateEvent={handleCreateEvent}
                onUpdateEvent={handleUpdateEvent}
                key={`${date}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
