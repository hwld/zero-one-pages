import { forwardRef, useRef } from "react";
import { useMergedRef } from "@mantine/hooks";
import { useMoveWeekEvent } from "./move-event-provider";
import { usePrepareCreateWeekEvent } from "./prepare-create-event-provider";
import { AnimatePresence, motion } from "framer-motion";
import { WeekEventCard, WeekEventCardProps } from "./card/week-event-card";
import { MoreWeekEventsCard } from "./card/more-week-even";
import { DragPreviewWeekEventsCard } from "./card/drag-preview";
import { WeekEvent } from "./type";
import { getExceededEventCountByDayOfWeek } from "./utils";
import { useResizeWeekEvent } from "./resize-event-provider";

type Props = {
  week: Date[];
  allWeekEvents: WeekEvent[];
  eventLimit?: number;
  eventHeight: number;
  eventTop?: number;
  onClickMoreWeekEvents?: (date: Date) => void;
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
    const { isEventResizing, resizeEventPreview, resizeEventActions } =
      useResizeWeekEvent();

    const dragDateRangeForCreate = prepareCreateEventState.dragDateRange;
    const isDraggingForCreate = dragDateRangeForCreate !== undefined;

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

      if (isEventResizing) {
        resizeEventActions.updateResizeDest(date);
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

    const handleStartResizeEvent: WeekEventCardProps["onStartResize"] = (
      _,
      { event, origin },
    ) => {
      resizeEventActions.startResize({ event, origin });
    };

    const visibleWeekEvents =
      eventLimit === undefined
        ? allWeekEvents
        : allWeekEvents.filter((e) => e.top < eventLimit);

    const exceededEventCountMap =
      eventLimit !== undefined
        ? getExceededEventCountByDayOfWeek({
            week,
            weekEvents: allWeekEvents,
            limit: eventLimit,
          })
        : undefined;

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
            const isResizing =
              isEventResizing && resizeEventPreview?.id === event.id;

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
                  disablePointerEvents={
                    isDraggingForCreate || isEventMoving || isResizing
                  }
                  draggable
                  onMouseDown={(e) => e.stopPropagation()}
                  onDragStart={(e) => handleEventDragStart(e, event)}
                  onStartResize={handleStartResizeEvent}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        {/* 表示上限を超えたイベントの数 */}
        {eventLimit !== undefined &&
          exceededEventCountMap !== undefined &&
          week.map((date) => {
            const weekDay = date.getDay();
            const count = exceededEventCountMap.get(weekDay);
            if (!count) {
              return null;
            }

            const handleClick = () => {
              onClickMoreWeekEvents?.(date);
            };

            return (
              <MoreWeekEventsCard
                key={weekDay}
                topMargin={eventTop}
                weekDay={weekDay}
                count={count}
                limit={eventLimit}
                eventsRowCols={week.length}
                disablePointerEvents={isDraggingForCreate || isEventMoving}
                height={eventHeight}
                onClick={handleClick}
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
