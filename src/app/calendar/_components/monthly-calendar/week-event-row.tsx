import { forwardRef, useRef } from "react";
import { WeekEvent } from "../../type";
import { Event } from "../../_mocks/event-store";
import { MONTHLY_EVENT_ROW_SIZE } from "../../consts";
import { MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { useMergedRef } from "@mantine/hooks";
import clsx from "clsx";
import { useMoveEvent } from "./move-event-provider";
import { PrepareCreateEventActions } from "./prepare-create-event-provider";
import { AnimatePresence, motion } from "framer-motion";
import { WeekEventCard } from "./week-event-card/week-event-card";
import { DragPreviewWeekEventsCard } from "./week-event-card/drag-preview";
import { MoreWeekEventsCard } from "./week-event-card/more-week-even";

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
    const { moveEventPreview, moveEventActions } = useMoveEvent();

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
            return (
              <motion.div
                key={event.id}
                className={clsx(
                  moveEventPreview?.event.id === event.id && "opacity-50",
                )}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <WeekEventCard
                  topMargin={MONTHLY_DATE_HEADER_HEIGHT}
                  height={MONTHLY_EVENT_ROW_SIZE}
                  disablePointerEvents={
                    !!isDraggingForCreate || !!moveEventPreview
                  }
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
              disablePointerEvents={!!isDraggingForCreate || !!moveEventPreview}
              height={MONTHLY_EVENT_ROW_SIZE}
            />
          );
        })}
        {moveEventPreview ? (
          <DragPreviewWeekEventsCard
            week={week}
            draggingEvent={moveEventPreview}
            topMargin={MONTHLY_DATE_HEADER_HEIGHT}
            height={MONTHLY_EVENT_ROW_SIZE}
          />
        ) : null}
      </div>
    );
  },
);
