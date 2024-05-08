import { forwardRef, useRef } from "react";
import { WeekEvent } from "../type";
import { Event } from "../mocks/event-store";
import { MoreWeekEventsCard, WeekEventCard } from "./week-event-card";
import { MONTHLY_EVENT_ROW_SIZE } from "../consts";
import { MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { DragDateRange } from "../utils";
import { useMergedRef } from "@mantine/hooks";
import { DraggingEventPreview } from "./dragging-event-preview";
import clsx from "clsx";
import { MoveEventActions, MovingEvent } from "./use-move-event";

type Props = {
  week: Date[];
  weekEvents: WeekEvent[];
  eventLimit: number;
  exceededEventCountMap: Map<number, number>;
  dragDateRange: DragDateRange | undefined;
  onChangeDragDateRange: (range: DragDateRange | undefined) => void;
  movingEvent: MovingEvent | undefined;
  moveEventActions: MoveEventActions;
};

export const WeekEventRow = forwardRef<HTMLDivElement, Props>(
  function WeekEventRow(
    {
      week,
      weekEvents,
      eventLimit,
      exceededEventCountMap,
      dragDateRange,
      onChangeDragDateRange,
      movingEvent,
      moveEventActions,
    },
    _ref,
  ) {
    const rowRef = useRef<HTMLDivElement>(null);
    const ref = useMergedRef(_ref, rowRef);

    const getDateFromX = (x: number) => {
      if (!rowRef.current) {
        throw new Error("");
      }

      const rowRect = rowRef.current.getBoundingClientRect();
      const weekDay = Math.floor((x - rowRect.x) / (rowRect.width / 7));

      return week[weekDay];
    };

    const handleRowMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      const date = getDateFromX(event.clientX);
      onChangeDragDateRange({ dragStartDate: date, dragEndDate: date });
    };

    const handleRowMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const date = getDateFromX(event.clientX);

      if (dragDateRange) {
        onChangeDragDateRange({ ...dragDateRange, dragEndDate: date });
      }

      if (movingEvent) {
        moveEventActions.updateMoveEnd(date);
      }
    };

    const handleEventDragStart = (
      e: React.DragEvent<HTMLButtonElement>,
      event: Event,
    ) => {
      // dragの開始をハンドリングしたいだけなので他の挙動は抑制する
      e.preventDefault();

      const date = getDateFromX(e.clientX);
      moveEventActions.startMove(event, date);
    };

    return (
      <div
        ref={ref}
        className="absolute bottom-0 left-0 top-0 w-full gap-1"
        onMouseDown={handleRowMouseDown}
        onMouseMove={handleRowMouseMove}
      >
        {weekEvents.map((event) => {
          return (
            <div
              key={event.id}
              className={clsx(
                movingEvent?.event.id === event.id && "opacity-50",
              )}
            >
              <WeekEventCard
                topMargin={MONTHLY_DATE_HEADER_HEIGHT}
                height={MONTHLY_EVENT_ROW_SIZE}
                disablePointerEvents={!!dragDateRange || !!movingEvent}
                weekEvent={event}
                onMouseDown={(e) => e.stopPropagation()}
                draggable
                onDragStart={(e) => handleEventDragStart(e, event)}
              />
            </div>
          );
        })}
        {/* 表示上限を超えたイベントの数 */}
        {week.map((date) => {
          const weekDay = date.getDay();
          const count = exceededEventCountMap.get(weekDay);

          if (!count) {
            return null;
          }

          return (
            <MoreWeekEventsCard
              key={weekDay}
              topMargin={MONTHLY_DATE_HEADER_HEIGHT}
              weekDay={weekDay}
              count={count}
              limit={eventLimit}
              disablePointerEvents={!!dragDateRange || !!movingEvent}
              height={MONTHLY_EVENT_ROW_SIZE}
            />
          );
        })}
        {movingEvent ? (
          <DraggingEventPreview
            week={week}
            draggingEvent={movingEvent}
            topMargin={MONTHLY_DATE_HEADER_HEIGHT}
            height={MONTHLY_EVENT_ROW_SIZE}
          />
        ) : null}
      </div>
    );
  },
);
