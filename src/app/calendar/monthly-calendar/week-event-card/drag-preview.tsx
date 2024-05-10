import { forwardRef, useMemo } from "react";
import { WeekEvent } from "../../type";
import { WeekEventCardBase, WeekEventCardContent } from "./base";
import { DraggingEvent } from "../../utils";
import { differenceInDays, addDays } from "date-fns";
import { convertEventToWeekEvent } from "../utils";

type Props = {
  week: Date[];
  draggingEvent: DraggingEvent;
  topMargin?: number;
  height: number;
};

export const DragPreviewWeekEventsCard = forwardRef<HTMLButtonElement, Props>(
  function WeekEventCard({ week, draggingEvent, topMargin = 0, height }, ref) {
    const weekEvent: WeekEvent | undefined = useMemo(() => {
      const { event, dragStartDate, dragEndDate } = draggingEvent;

      const diffDay = differenceInDays(dragEndDate, dragStartDate);
      const newEvent = {
        ...event,
        start: addDays(event.start, diffDay),
        end: addDays(event.end, diffDay),
      };

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
          {" "}
          <WeekEventCardContent weekEvent={weekEvent} isDragging={true} />
        </WeekEventCardBase>
      </div>
    );
  },
);
