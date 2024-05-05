import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import { NewEvent } from "./new-event";
import {
  EVENT_MIN_HEIGHT,
  EVENT_MIN_MINUTES,
  getDateEvents,
  getDateFromY,
  getHeightFromInterval,
} from "./utils";
import {
  DragEvent,
  MouseEvent,
  MutableRefObject,
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { DateEvent, DraggingDateEvent, Event } from "../type";
import { DateEventCard, PreviewDateEventCard } from "./date-event-card";

export type MouseHistory = { y: number; scrollTop: number };

export type EventCreationDragData = {
  targetDate: Date;
  startDate: Date;
  endDate: Date;
};

type Props = {
  currentDate: Date;
  date: Date;
  timedEvents: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onChangeDraggingEvent: (event: DraggingDateEvent | undefined) => void;
  eventCreationDragData: EventCreationDragData | undefined;
  scrollableRef: RefObject<HTMLDivElement>;
  mouseHistoryRef: MutableRefObject<MouseHistory | undefined>;
  onChangeEventCreationDragData: (
    state: EventCreationDragData | undefined,
  ) => void;
  onUpdateEvent: (event: Event) => void;
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  {
    currentDate,
    date,
    timedEvents,
    draggingEvent,
    onChangeDraggingEvent,
    scrollableRef,
    mouseHistoryRef,
    eventCreationDragData,
    onChangeEventCreationDragData,
    onUpdateEvent,
  },
  ref,
) {
  const columnRef = useRef<HTMLDivElement>(null);
  const dateEvents = getDateEvents({ date, events: timedEvents });

  const hours = useMemo(
    () =>
      eachHourOfInterval({
        start: startOfDay(date),
        end: endOfDay(date),
      }),
    [date],
  );

  const handleColumnMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!columnRef.current || !scrollableRef.current || e.button !== 0) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = e.clientY - columnY;

    mouseHistoryRef.current = {
      y,
      scrollTop: scrollableRef.current.scrollTop,
    };

    const targetDate = startOfDay(date);

    // ドラッグ開始の時点では常にクリックした最小領域が期間として設定されるようにする
    const startDate = getDateFromY(targetDate, y, "floor");
    const endDate = addMinutes(startDate, EVENT_MIN_MINUTES);

    onChangeEventCreationDragData({
      targetDate,
      startDate,
      endDate,
    });
  };

  const updateEventCreationDragData = (mouseY: number) => {
    if (
      !eventCreationDragData ||
      !columnRef.current ||
      !scrollableRef.current
    ) {
      return;
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    const y = mouseY - columnY;

    mouseHistoryRef.current = {
      y,
      scrollTop: scrollableRef.current.scrollTop,
    };
    onChangeEventCreationDragData({
      ...eventCreationDragData,
      endDate: getDateFromY(eventCreationDragData.targetDate, y),
    });
  };

  const updateDraggingEvent = (mouseY: number) => {
    if (!draggingEvent || !dropPreviewRef.current || !columnRef.current) {
      return;
    }

    const columnRect = columnRef.current.getBoundingClientRect();
    const previewHeight = getHeightFromInterval(draggingEvent, date);

    let previewTop = mouseY - columnRect.y - draggingEvent.dragStartY;
    if (previewTop < 0) {
      previewTop = 0;
    }
    if (previewTop > columnRect.height - previewHeight) {
      previewTop = columnRect.height - previewHeight;
    }
    const gap = previewTop % EVENT_MIN_HEIGHT;
    previewTop = previewTop - gap;

    const startDate = getDateFromY(date, previewTop);
    const endDate = addMinutes(
      startDate,
      differenceInMinutes(draggingEvent.end, draggingEvent.start),
    );

    onChangeDraggingEvent({ ...draggingEvent, start: startDate, end: endDate });
  };

  const handleColumnMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (eventCreationDragData) {
      updateEventCreationDragData(e.clientY);
    }

    if (draggingEvent) {
      updateDraggingEvent(e.clientY);
    }
  };

  const dropPreviewRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    dateEvent: DateEvent,
  ) => {
    // dragImageがうまく設定できなかったので、DnD APIではなくマウスイベントで処理する
    event.preventDefault();

    const dateEventY = event.currentTarget.getBoundingClientRect().y;
    onChangeDraggingEvent({
      ...dateEvent,
      dragStartY: event.clientY - dateEventY,
    });
  };

  const isPreviewVisible = useMemo(() => {
    if (!draggingEvent) {
      return false;
    }

    return areIntervalsOverlapping(
      {
        start: startOfDay(date),
        end: endOfDay(date),
      },
      draggingEvent,
    );
  }, [date, draggingEvent]);

  const currentTimeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!currentTimeRef.current) {
      return;
    }

    currentTimeRef.current.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <div
        ref={columnRef}
        className="relative border-r border-neutral-300"
        style={{ height: EVENT_MIN_HEIGHT * 4 * 24 }}
        draggable={false}
        onMouseDown={handleColumnMouseDown}
        onMouseMove={handleColumnMouseMove}
      >
        {hours.map((hour, i) => {
          if (i === 0) {
            return null;
          }
          return (
            <div
              key={`${hour}`}
              className="absolute h-[1px] w-full bg-neutral-300"
              style={{ top: EVENT_MIN_HEIGHT * 4 * i }}
            />
          );
        })}
        {isSameDay(currentDate, date) ? (
          <div
            ref={currentTimeRef}
            className="absolute z-30 h-[1px] w-full border-y-[1px] border-blue-500 bg-blue-500"
            style={{
              top:
                (EVENT_MIN_HEIGHT / EVENT_MIN_MINUTES) *
                differenceInMinutes(currentDate, startOfDay(currentDate)),
            }}
          >
            <div className="absolute left-0 size-3 -translate-x-[50%] -translate-y-[50%] rounded-full bg-blue-500" />
          </div>
        ) : null}
        {/* TODO: ドラッグを開始した日付だけじゃなく、複数の日付にまたがったイベントを作成できるようにする*/}
        {eventCreationDragData &&
          isSameDay(date, eventCreationDragData.targetDate) && (
            <NewEvent
              date={date}
              eventCreationDragData={eventCreationDragData}
            />
          )}
        {dateEvents.map((event) => {
          const dragging = event.id === draggingEvent?.id;

          return (
            <DateEventCard
              dateColumnRef={columnRef}
              key={event.id}
              event={event}
              onDragStart={handleDragStart}
              onEventUpdate={onUpdateEvent}
              dragging={dragging}
              draggingOther={draggingEvent ? !dragging : false}
            />
          );
        })}
        <PreviewDateEventCard
          date={date}
          ref={dropPreviewRef}
          event={draggingEvent}
          visible={isPreviewVisible}
        />
      </div>
    </div>
  );
});
