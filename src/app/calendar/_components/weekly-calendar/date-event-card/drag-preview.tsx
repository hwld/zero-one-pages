import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { DateEvent } from "../../../type";
import { getTopFromDate, getHeightFromInterval } from "../utils";
import { DateEventCardBase, DateEventCardContent } from "./base";
import { areIntervalsOverlapping, endOfDay, startOfDay } from "date-fns";

type Props = {
  date: Date;
  event: DateEvent;
};

export const DragPreviewDateEventCard = forwardRef<HTMLButtonElement, Props>(
  function DragPreviewDateEventCard({ date, event }, ref) {
    const style = useMemo(() => {
      if (
        event &&
        !areIntervalsOverlapping(event, {
          start: startOfDay(date),
          end: endOfDay(date),
        })
      ) {
        return { display: "none" };
      }

      const top = event && getTopFromDate(event, date);
      const height = event && getHeightFromInterval(event, date);

      return { top, height };
    }, [date, event]);

    return (
      <DateEventCardBase
        ref={ref}
        className={clsx(
          "pointer-events-none z-20 w-full bg-neutral-800 ring ring-blue-500",
        )}
        style={style}
      >
        {event && <DateEventCardContent event={event} />}
      </DateEventCardBase>
    );
  },
);
