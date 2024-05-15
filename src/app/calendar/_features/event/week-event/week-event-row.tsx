import { forwardRef, useRef } from "react";
import { useMergedRef } from "@mantine/hooks";
import { useMoveWeekEvent } from "./move-event-provider";
import { usePrepareCreateWeekEvent } from "./prepare-create-event-provider";
import { AnimatePresence, motion } from "framer-motion";
import { WeekEventCard } from "./card/week-event-card";
import { MoreWeekEventsCard } from "./card/more-week-even";
import { DragPreviewWeekEventsCard } from "./card/drag-preview";
import { WeekEvent } from "./type";
import { getExceededEventCountByDayOfWeek } from "./utils";

type Props = {
  week: Date[];
  allWeekEvents: WeekEvent[];
  eventLimit?: number;
  eventHeight: number;
  eventTop?: number;
  onClickMoreWeekEvents?: () => void;
};

export const WeekEventRow = forwardRef<HTMLDivElement, Props>(
  function WeekEventRow(
    {
      week,
      allWeekEvents,
      eventLimit,
      eventHeight,
      eventTop,
      onClickMoreWeekEvents,
    },
    _ref,
  ) {
    const { isEventMoving, moveEventPreview, moveEventActions } =
      useMoveWeekEvent();

    const { prepareCreateEventState, prepareCreateEventActions } =
      usePrepareCreateWeekEvent();
    const isDraggingForCreate =
      prepareCreateEventState.dragDateRange !== undefined;

    const rowRef = useRef<HTMLDivElement>(null);
    const ref = useMergedRef(_ref, rowRef);

    const visibleWeekEvents = allWeekEvents.filter((e) => {
      if (eventLimit === undefined) {
        return true;
      }
      return e.top < eventLimit;
    });

    // TODO:
    const exceededEventCountMap =
      eventLimit !== undefined
        ? getExceededEventCountByDayOfWeek({
            week,
            weekEvents: allWeekEvents,
            limit: eventLimit,
          })
        : undefined;

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
      prepareCreateEventActions.startDrag(date);
    };

    const handleRowMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const date = getDateFromX(event.clientX);

      if (isDraggingForCreate) {
        prepareCreateEventActions.updateDragEnd(date);
      }

      if (moveEventPreview) {
        moveEventActions.updateMoveEnd(date);
      }
    };

    const handleEventDragStart = (
      e: React.DragEvent<HTMLButtonElement>,
      event: WeekEvent,
    ) => {
      // dragの開始をハンドリングしたいだけなので他の挙動は抑制する
      e.preventDefault();

      const date = getDateFromX(e.clientX);
      moveEventActions.startMove(event, date);
    };

    return (
      <div
        ref={ref}
        className="relative h-full w-full"
        onMouseDown={handleRowMouseDown}
        onMouseMove={handleRowMouseMove}
      >
        <AnimatePresence>
          {visibleWeekEvents.map((event) => {
            const isDragging =
              isEventMoving && moveEventPreview?.id === event.id;

            return (
              <motion.div
                key={event.id}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <WeekEventCard
                  weekEvent={event}
                  isDragging={isDragging}
                  topMargin={eventTop}
                  height={eventHeight}
                  disablePointerEvents={isDraggingForCreate || isEventMoving}
                  draggable
                  onMouseDown={(e) => e.stopPropagation()}
                  onDragStart={(e) => handleEventDragStart(e, event)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        {/* 表示上限を超えたイベントの数 */}
        {week.map((date) => {
          if (!exceededEventCountMap || eventLimit === undefined) {
            return null;
          }

          const weekDay = date.getDay();
          const count = exceededEventCountMap.get(weekDay);
          if (!count) {
            return null;
          }

          return (
            <MoreWeekEventsCard
              key={weekDay}
              topMargin={eventTop}
              weekDay={weekDay}
              count={count}
              limit={eventLimit}
              disablePointerEvents={isDraggingForCreate || isEventMoving}
              height={eventHeight}
              onClick={onClickMoreWeekEvents}
            />
          );
        })}
        {isEventMoving && moveEventPreview && (
          <DragPreviewWeekEventsCard
            week={week}
            draggingEvent={moveEventPreview}
            topMargin={eventTop}
            height={eventHeight}
          />
        )}
      </div>
    );
  },
);
