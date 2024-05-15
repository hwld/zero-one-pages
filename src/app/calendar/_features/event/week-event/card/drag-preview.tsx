import { forwardRef, useMemo } from "react";
import { convertEventToWeekEvent } from "../utils";
import { DraggingEvent, getEventFromDraggingEvent } from "../../../utils";
import { WeekEvent } from "../type";
import { WeekEventCardBase, WeekEventCardContent } from "./base";

type Props = {
  week: Date[];
  draggingEvent: DraggingEvent;
  topMargin?: number;
  height: number;
};

export const DragPreviewWeekEventsCard = forwardRef<HTMLButtonElement, Props>(
  function WeekEventCard({ week, draggingEvent, topMargin = 0, height }, ref) {
    const weekEvent: WeekEvent | undefined = useMemo(() => {
      const newEvent = getEventFromDraggingEvent(draggingEvent);
      return convertEventToWeekEvent(newEvent, { top: 0, week });
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
          startWeekDay={weekEvent.startWeekDay}
          range={weekEvent.endWeekDay - weekEvent.startWeekDay + 1}
          top={weekEvent.top}
        >
          <WeekEventCardContent weekEvent={weekEvent} isDragging={true} />
        </WeekEventCardBase>
      </div>
    );
  },
);
