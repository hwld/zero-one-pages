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
} & ComponentPropsWithoutRef<"button">;

const WeekEventCardBase: React.FC<WeekEventCardBaseProps> = ({
  disablePointerEvents,
  height,
  range = 1,
  top,
  startWeekDay,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "absolute pb-[1px] text-sm text-neutral-100",
        disablePointerEvents ? "pointer-events-none" : "pointer-events-auto",
      )}
      style={{
        height: `${height}px`,
        width: `calc(100% / 7  * ${range} - 10px)`,
        top: `calc(${height}px * ${top})`,
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
  weekEvent: WeekEvent;
};
export const WeekEventCard: React.FC<WeekEventCardProps> = ({
  height,
  disablePointerEvents,
  weekEvent,
}) => {
  return (
    <WeekEventCardBase
      height={height}
      disablePointerEvents={disablePointerEvents}
      top={weekEvent.top}
      startWeekDay={weekEvent.startWeekDay}
      range={weekEvent.endWeekDay - weekEvent.startWeekDay + 1}
    >
      <div className="flex h-full items-center rounded bg-neutral-700 px-1 text-xs transition-colors hover:bg-neutral-800">
        {!weekEvent.allDay ? (
          <span className="mr-1">{format(weekEvent.start, "aa hh:mm")}</span>
        ) : null}

        {weekEvent.title}
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
  onClick?: () => void;
};
export const MoreWeekEventsCard: React.FC<MoreWeekEventsCardProps> = ({
  count,
  limit,
  height,
  disablePointerEvents,
  weekDay,
  onClick,
}) => {
  return (
    <WeekEventCardBase
      height={height}
      disablePointerEvents={disablePointerEvents}
      top={limit}
      startWeekDay={weekDay}
      range={1}
      onClick={onClick}
    >
      <div className="flex h-full w-full items-center rounded px-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-900/10">
        他<span className="mx-1">{count}</span>件
      </div>
    </WeekEventCardBase>
  );
};
