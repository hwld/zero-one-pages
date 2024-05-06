import clsx from "clsx";
import { Event } from "../mocks/event-store";
import { DragDateRange, isWithinDragDateRange } from "../utils";
import { EVENT_MIN_HEIGHT } from "./utils";
import { isWithinInterval } from "date-fns";
import { LONG_TERM_EVENT_DISPLAY_LIMIT } from "./long-term-event-row";

export const CELL_Y_MARGIN = 4;

const calcCellHeight = (
  events: number,
  { expanded }: { expanded: boolean },
): number => {
  // "制限を超えている数"を表示する高さを確保する
  if (events > LONG_TERM_EVENT_DISPLAY_LIMIT && !expanded) {
    return (
      EVENT_MIN_HEIGHT +
      EVENT_MIN_HEIGHT * LONG_TERM_EVENT_DISPLAY_LIMIT +
      CELL_Y_MARGIN * 2
    );
  }

  return EVENT_MIN_HEIGHT * Math.max(events, 1) + CELL_Y_MARGIN * 2;
};

type Props = {
  date: Date;
  dragDateRange: DragDateRange | undefined;
  events: Event[];
  expanded: boolean;
};

export const LongTermEventCell: React.FC<Props> = ({
  date,
  dragDateRange,
  events,
  expanded,
}) => {
  const eventsOnDate = events.filter((e) => isWithinInterval(date, e)).length;
  const isDragging = dragDateRange !== undefined;

  return (
    <div
      className={clsx(
        "grow border-y border-r border-neutral-300",
        isDragging && isWithinDragDateRange(date, dragDateRange)
          ? "bg-neutral-500/15"
          : "",
      )}
      style={{
        height: `${calcCellHeight(eventsOnDate, { expanded })}px`,
      }}
    />
  );
};
