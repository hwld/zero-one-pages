import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { format } from "date-fns";
import { WeekEvent } from "../../type";

type Props = {
  disablePointerEvents: boolean;
  height: number;
  range?: number;
  top: number;
  startWeekDay: number;
  topMargin?: number;
} & ComponentPropsWithoutRef<"button">;

export const WeekEventCardBase = forwardRef<HTMLButtonElement, Props>(
  function WeekEventCardBase(
    {
      disablePointerEvents,
      height,
      range = 1,
      top,
      startWeekDay,
      children,
      topMargin = 0,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          "group absolute select-none pb-[1px] text-sm text-neutral-100 focus-visible:outline-none",
          disablePointerEvents ? "pointer-events-none" : "pointer-events-auto",
        )}
        style={{
          height: `${height}px`,
          width: `calc(100% / 7  * ${range} - 10px)`,
          top: `calc(${topMargin}px + ${height}px * ${top})`,
          left: `calc(100% / 7 * ${startWeekDay})`,
        }}
      >
        {children}
      </button>
    );
  },
);

type ContentProps = { weekEvent: WeekEvent; isDragging: boolean };
export const WeekEventCardContent: React.FC<ContentProps> = ({
  weekEvent,
  isDragging,
}) => {
  return (
    <div
      className={clsx(
        "flex h-full flex-nowrap items-center rounded bg-neutral-700 px-1 text-xs ring-blue-500 transition-colors hover:bg-neutral-800 group-focus-visible:ring",
        isDragging && "bg-neutral-800 ring",
      )}
    >
      {!weekEvent.allDay ? (
        <span className="mr-1 text-nowrap text-neutral-300">
          {format(weekEvent.start, "aa hh:mm")}
        </span>
      ) : null}
      <span className="truncate">{weekEvent.title}</span>
    </div>
  );
};
