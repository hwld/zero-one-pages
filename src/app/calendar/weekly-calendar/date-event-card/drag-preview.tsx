import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { DateEvent } from "../../type";
import { getTopFromDate, getHeightFromInterval } from "../utils";
import { DateEventCardBase, DateEventCardContent } from "./base";

type Props = {
  date: Date;
  event: DateEvent | undefined;
  visible: boolean;
};

export const DragPreviewDateEventCard = forwardRef<HTMLDivElement, Props>(
  function PreviewDateEventCard({ date, event, visible }, ref) {
    const style = useMemo(() => {
      const top = event && getTopFromDate(event, date);
      const height = event && getHeightFromInterval(event, date);

      return { top, height };
    }, [date, event]);

    return (
      <DateEventCardBase
        ref={ref}
        className={clsx(
          "pointer-events-none z-20 w-full bg-neutral-800 ring ring-blue-500",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={style}
      >
        {event && <DateEventCardContent event={event} />}
      </DateEventCardBase>
    );
  },
);
