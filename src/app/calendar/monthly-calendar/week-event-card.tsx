import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { WeekEvent } from "../type";
import { format } from "date-fns";

type WeekEventCardBaseProps = {
  disablePointerEvents: boolean;
  height: number;
  range?: number;
  top: number;
  startWeekDay: number;
  topMargin?: number;
} & ComponentPropsWithoutRef<"button">;

const WeekEventCardBase: React.FC<WeekEventCardBaseProps> = ({
  disablePointerEvents,
  height,
  range = 1,
  top,
  startWeekDay,
  children,
  topMargin = 0,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "absolute select-none pb-[1px] text-sm text-neutral-100",
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
};

type WeekEventCardProps = {
  height: number;
  disablePointerEvents: boolean;
  isDragging?: boolean;
  weekEvent: WeekEvent;
  topMargin?: number;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const WeekEventCard: React.FC<WeekEventCardProps> = ({
  height,
  disablePointerEvents,
  isDragging = false,
  weekEvent,
  topMargin,
  ...props
}) => {
  return (
    <WeekEventCardBase
      height={height}
      disablePointerEvents={disablePointerEvents}
      top={weekEvent.top}
      startWeekDay={weekEvent.startWeekDay}
      range={weekEvent.endWeekDay - weekEvent.startWeekDay + 1}
      topMargin={topMargin}
      {...props}
    >
      <div
        className={clsx(
          "flex h-full flex-nowrap items-center rounded bg-neutral-700 px-1 text-xs transition-colors hover:bg-neutral-800",
          isDragging && "bg-neutral-800 ring ring-blue-500",
        )}
      >
        {!weekEvent.allDay ? (
          <span className="mr-1 text-nowrap text-neutral-300">
            {format(weekEvent.start, "aa hh:mm")}
          </span>
        ) : null}
        <span className="truncate">{weekEvent.title}</span>
      </div>
    </WeekEventCardBase>
  );
};

type MoreWeekEventsCardProps = {
  count: number;
  limit: number;
  height: number;
  disablePointerEvents: boolean;
  weekDay: number;
  topMargin?: number;
  onClick?: () => void;
};

export const MoreWeekEventsCard: React.FC<MoreWeekEventsCardProps> = ({
  count,
  limit,
  height,
  disablePointerEvents,
  weekDay,
  topMargin,
  onClick,
}) => {
  return (
    <WeekEventCardBase
      height={height}
      disablePointerEvents={disablePointerEvents}
      top={limit}
      startWeekDay={weekDay}
      range={1}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClick}
      topMargin={topMargin}
    >
      <div className="flex h-full w-full items-center rounded px-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-900/10">
        他<span className="mx-1">{count}</span>件
      </div>
    </WeekEventCardBase>
  );
};
