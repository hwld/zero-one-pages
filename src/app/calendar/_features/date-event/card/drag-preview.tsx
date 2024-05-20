import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { DateEvent } from "../type";
import { getTopFromDate, getHeightFromInterval } from "../utils";
import { DateEventCardBase, DateEventCardContent } from "./base";

type Props = {
  date: Date;
  event: DateEvent;
};

export const DragPreviewDateEventCard = forwardRef<HTMLButtonElement, Props>(
  function DragPreviewDateEventCard({ date, event }, ref) {
    const style = useMemo(() => {
      const top = event && getTopFromDate(event, date);
      const height = event && getHeightFromInterval(event, date);

      return { top, height, width: "100%" };
    }, [date, event]);

    return (
      <DateEventCardBase
        ref={ref}
        className={clsx("pointer-events-none z-30 bg-neutral-900 ring")}
        style={style}
      >
        {event && <DateEventCardContent event={event} />}
      </DateEventCardBase>
    );
  },
);
