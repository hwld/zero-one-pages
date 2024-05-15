import { forwardRef, useRef } from "react";
import { Event } from "../../../_mocks/event-store";
import { MONTHLY_EVENT_ROW_SIZE } from "../../../consts";
import { MONTHLY_DATE_HEADER_HEIGHT } from "../../monthly-calendar/calendar-date";
import { useMergedRef } from "@mantine/hooks";
import { useMoveEvent } from "../../monthly-calendar/move-event-provider";
import { PrepareCreateEventActions } from "../../monthly-calendar/prepare-create-event-provider";
import { AnimatePresence, motion } from "framer-motion";
import { WeekEventCard } from "./card/week-event-card";
import { MoreWeekEventsCard } from "./card/more-week-even";
import { DragPreviewWeekEventsCard } from "./card/drag-preview";
import { WeekEvent } from "./type";

type Props = {
  week: Date[];
  weekEvents: WeekEvent[];
  eventLimit: number;
  exceededEventCountMap: Map<number, number>;
  isDraggingForCreate: boolean;
  prepareCreateEventActions: PrepareCreateEventActions;
};

export const WeekEventRow = forwardRef<HTMLDivElement, Props>(
  function WeekEventRow(
    {
      week,
      weekEvents,
      eventLimit,
      exceededEventCountMap,
      isDraggingForCreate,
      prepareCreateEventActions,
    },
    _ref,
  ) {
    const { isEventMoving, moveEventPreview, moveEventActions } =
      useMoveEvent();

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
        <AnimatePresence>
          {weekEvents.map((event) => {
            const isDragPreview = moveEventPreview?.event.id === event.id;

            const isDragging = isEventMoving && isDragPreview;

            return (
              <motion.div
                key={event.id}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <WeekEventCard
                  isDragging={isDragging}
                  topMargin={MONTHLY_DATE_HEADER_HEIGHT}
                  height={MONTHLY_EVENT_ROW_SIZE}
                  disablePointerEvents={isDraggingForCreate || isEventMoving}
                  weekEvent={event}
                  onMouseDown={(e) => e.stopPropagation()}
                  draggable
                  onDragStart={(e) => handleEventDragStart(e, event)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
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
              disablePointerEvents={isDraggingForCreate || isEventMoving}
              height={MONTHLY_EVENT_ROW_SIZE}
            />
          );
        })}
        {isEventMoving && moveEventPreview && (
          <DragPreviewWeekEventsCard
            week={week}
            draggingEvent={moveEventPreview}
            topMargin={MONTHLY_DATE_HEADER_HEIGHT}
            height={MONTHLY_EVENT_ROW_SIZE}
          />
        )}
      </div>
    );
  },
);
