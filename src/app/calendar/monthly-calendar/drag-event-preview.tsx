import { useMemo } from "react";
import { DragEvent } from "../utils";
import { addDays, differenceInDays } from "date-fns";
import { WeekEvent } from "../type";
import { convertEventToWeekEvent } from "./utils";
import { WeekEventCard } from "./week-event-card";
import { MONTHLY_EVENT_ROW_SIZE } from "../consts";
import { MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";

type Props = { week: Date[]; dragEvent: DragEvent };
export const DragEventPreview: React.FC<Props> = ({ week, dragEvent }) => {
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
        topMargin={MONTHLY_DATE_HEADER_HEIGHT}
        height={MONTHLY_EVENT_ROW_SIZE}
        weekEvent={weekEvent}
        disablePointerEvents={true}
      />
    </div>
  );
};
