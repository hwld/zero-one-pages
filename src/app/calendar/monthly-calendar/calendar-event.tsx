import clsx from "clsx";
import { EVENT_ROW_SIZE } from "../consts";
import { ReactNode } from "react";

type Props = {
  isDraggingDate: boolean;
  range?: number;
  top: number;
  startWeekDay: number;
  children: ReactNode;
};

export const CalendarEvent: React.FC<Props> = ({
  isDraggingDate,
  range = 1,
  top,
  startWeekDay,
  children,
}) => {
  return (
    <button
      className={clsx(
        "absolute pb-[1px] text-sm text-neutral-100",
        isDraggingDate ? "pointer-events-none" : "pointer-events-auto",
      )}
      style={{
        height: `${EVENT_ROW_SIZE}px`,
        width: `calc(100% / 7  * ${range} - 10px)`,
        top: `calc(${EVENT_ROW_SIZE}px * ${top})`,
        left: `calc(100% / 7 * ${startWeekDay})`,
      }}
    >
      {children}
    </button>
  );
};
