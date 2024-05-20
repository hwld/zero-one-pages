import { WeekEventCardBase } from "./base";

type Props = {
  count: number;
  limit: number;
  height: number;
  eventsRowCols: number;
  disablePointerEvents: boolean;
  weekDay: number;
  topMargin?: number;
  onClick?: () => void;
};

export const MoreWeekEventsCard: React.FC<Props> = ({
  count,
  limit,
  height,
  eventsRowCols,
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
      displayStartCol={weekDay}
      eventsRowCols={eventsRowCols}
      eventCols={1}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClick}
      topMargin={topMargin}
    >
      <div className="flex h-full w-full items-center rounded px-1 text-xs text-neutral-700 ring-blue-500 transition-colors hover:bg-neutral-900/10">
        他<span className="mx-1">{count}</span>件
      </div>
    </WeekEventCardBase>
  );
};
