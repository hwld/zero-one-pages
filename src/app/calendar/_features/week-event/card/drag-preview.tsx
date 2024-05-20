import { forwardRef, useMemo } from "react";
import { convertEventToWeekEvent } from "../utils";
import { getEventFromMoveEventPreview } from "../utils";
import { MoveWeekEventPreview } from "../type";
import { WeekEvent } from "../type";
import { WeekEventCardBase, WeekEventCardContent } from "./base";

type Props = {
  week: Date[];
  draggingEvent: MoveWeekEventPreview;
  topMargin?: number;
  height: number;
};

export const DragPreviewWeekEventsCard = forwardRef<HTMLButtonElement, Props>(
  function WeekEventCard({ week, draggingEvent, topMargin = 0, height }, ref) {
    const weekEvent: WeekEvent | undefined = useMemo(() => {
      const newEvent = getEventFromMoveEventPreview(draggingEvent);
      return convertEventToWeekEvent(newEvent, {
        top: 0,
        displayDateRange: { start: week.at(0)!, end: week.at(-1)! },
      });
    }, [draggingEvent, week]);

    if (!weekEvent) {
      return null;
    }

    return (
      <div className="absolute left-0 top-0 w-full">
        <WeekEventCardBase
          ref={ref}
          height={height}
          topMargin={topMargin}
          disablePointerEvents={true}
          eventsRowCols={weekEvent.eventsRowCols}
          displayStartCol={weekEvent.displayStartCol}
          eventCols={weekEvent.displayEndCol - weekEvent.displayStartCol + 1}
          top={weekEvent.top}
        >
          <WeekEventCardContent weekEvent={weekEvent} isDragging={true} />
        </WeekEventCardBase>
      </div>
    );
  },
);
