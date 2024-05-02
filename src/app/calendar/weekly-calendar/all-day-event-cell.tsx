import clsx from "clsx";
import { Event } from "../type";
import { DragDateRange, isWithinDragDateRange } from "../utils";
import { EVENT_MIN_HEIGHT } from "./utils";
import { isWithinInterval } from "date-fns";

export const CELL_Y_MARGIN = 4;

const calcCellSize = (events: number): number => {
  return EVENT_MIN_HEIGHT * Math.max(events, 1) + CELL_Y_MARGIN * 2;
};

type Props = {
  date: Date;
  dragDateRange: DragDateRange | undefined;
  onDragDateRangeChange: (range: DragDateRange) => void;
  events: Event[];
};

export const AllDayEventCell: React.FC<Props> = ({
  date,
  dragDateRange,
  events,
  onDragDateRangeChange,
}) => {
  const eventsOnDate = events.filter((e) => isWithinInterval(date, e)).length;
  const isDragging = dragDateRange !== undefined;

  const handleMouseDown = () => {
    onDragDateRangeChange({ dragStartDate: date, dragEndDate: date });
  };

  const handleMouseEnter = () => {
    if (isDragging) {
      onDragDateRangeChange({ ...dragDateRange, dragEndDate: date });
    }
  };

  return (
    <div
      className={clsx(
        "grow border-y border-r border-neutral-300",
        isDragging && isWithinDragDateRange(date, dragDateRange)
          ? "bg-neutral-500/15"
          : "",
      )}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      style={{ height: `${calcCellSize(eventsOnDate)}px` }}
    />
  );
};
