import { useMemo } from "react";
import { DragEvent } from "../utils";
import { addDays, differenceInDays } from "date-fns";
import { WeekEvent } from "../type";
import { convertEventToWeekEvent } from "./utils";
import { WeekEventCard } from "./week-event-card";

type Props = {
  week: Date[];
  dragEvent: DragEvent;
  topMargin?: number;
  height: number;
};
export const DragEventPreview: React.FC<Props> = ({
  week,
  dragEvent,
  topMargin = 0,
  height,
}) => {
  const weekEvent: WeekEvent | undefined = useMemo(() => {
    const { event, dragStartDate, dragEndDate } = dragEvent;

    const diffDay = differenceInDays(dragEndDate, dragStartDate);
    const newEvent = {
      ...event,
      start: addDays(event.start, diffDay),
      end: addDays(event.end, diffDay),
    };

    return convertEventToWeekEvent(newEvent, { top: 0, week });
  }, [dragEvent, week]);

  if (!weekEvent) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 w-full">
      <WeekEventCard
        topMargin={topMargin}
        height={height}
        weekEvent={weekEvent}
        disablePointerEvents={true}
        isDragging={true}
      />
    </div>
  );
};
