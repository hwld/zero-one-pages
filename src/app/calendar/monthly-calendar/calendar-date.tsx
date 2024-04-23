import { max, min } from "date-fns";
import { DragDateRange, inDragDateRange } from "../utils";
import { Event } from "../type";
import clsx from "clsx";

type Props = {
  date: Date;
  dragDateRange: DragDateRange | undefined;
  onDragDateRangeChange: (range: DragDateRange | undefined) => void;
  onCreateEvent: (event: Event) => void;
};

export const CalendarDate: React.FC<Props> = ({
  date,
  dragDateRange,
  onDragDateRangeChange,
  onCreateEvent,
}) => {
  const handleMouseDown = () => {
    onDragDateRangeChange({ dragStartDate: date, dragEndDate: date });
  };

  const handleMouseOver = () => {
    if (dragDateRange) {
      onDragDateRangeChange({ ...dragDateRange, dragEndDate: date });
    }
  };

  const handleMouseUp = () => {
    if (!dragDateRange) {
      return;
    }

    const eventStart = min([
      dragDateRange.dragStartDate,
      dragDateRange.dragEndDate,
    ]);

    const eventEnd = max([
      dragDateRange.dragStartDate,
      dragDateRange.dragEndDate,
    ]);

    onCreateEvent({
      id: crypto.randomUUID(),
      title: "event",
      start: eventStart,
      end: eventEnd,
    });
    onDragDateRangeChange(undefined);
  };

  return (
    <div
      className={clsx(
        "relative select-none border-l border-t text-xs text-neutral-700",
        dragDateRange && inDragDateRange(date, dragDateRange)
          ? "bg-blue-500/20"
          : "",
      )}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseUp={handleMouseUp}
    >
      <div className="p-2">{date.getDate()}</div>
    </div>
  );
};
