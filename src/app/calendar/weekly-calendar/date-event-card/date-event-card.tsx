import { DragEvent, forwardRef, useMemo, useState } from "react";
import { DateEvent, ResizingDateEvent } from "../../type";
import { getHeightFromInterval, getTopFromDate } from "../utils";
import clsx from "clsx";
import { DateEventCardBase, DateEventCardContent } from "./base";
import { EventPopover } from "../../event-popover";

export type DateEventCardProps = {
  // 一つのイベントが複数の日にまたがる可能性があるので、どの日のイベントを表示するのかを指定する
  displayedDate: Date;
  event: DateEvent;
  dragging: boolean;
  draggingOther: boolean;
  onDragStart: (e: React.DragEvent, event: DateEvent) => void;
  isResizing: boolean;
  hidden?: boolean;
  isResizingOther: boolean;
  onStartResize: (
    e: React.MouseEvent,
    params: { event: DateEvent; origin: ResizingDateEvent["origin"] },
  ) => void;
};

export const DateEventCard = forwardRef<HTMLButtonElement, DateEventCardProps>(
  function DateEventCard(
    {
      event,
      displayedDate,
      dragging,
      draggingOther,
      onDragStart,
      hidden = false,
      isResizingOther,
      onStartResize,
    },
    ref,
  ) {
    const style = useMemo(() => {
      const top = getTopFromDate(event, displayedDate);

      const left =
        event.prevOverlappings === 0
          ? 0
          : (93 / (event.totalOverlappings + 1)) * event.prevOverlappings;

      const lastEventWidth =
        event.totalOverlappings === 0 ? 93 : 93 / (event.totalOverlappings + 1);

      const width =
        event.totalOverlappings === 0
          ? 93
          : event.totalOverlappings === event.prevOverlappings
            ? lastEventWidth
            : lastEventWidth * 1.7;

      const height = getHeightFromInterval(event, displayedDate);

      return { top, left: `${left}%`, width: `${width}%`, height };
    }, [displayedDate, event]);

    const handleResizeStartFromEventStart = (
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize(e, { event, origin: "eventEnd" });
    };

    const handleResizeStartFromEventEnd = (
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize(e, { event, origin: "eventStart" });
    };

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    if (hidden) {
      return null;
    }

    return (
      <EventPopover
        event={event}
        isOpen={isPopoverOpen}
        onChangeOpen={setIsPopoverOpen}
        placement="right-start"
      >
        <DateEventCardBase
          ref={ref}
          draggable
          onClick={() => {
            setIsPopoverOpen(true);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onDragStart={(e) => {
            onDragStart(e, event);
          }}
          style={style}
          className={clsx(
            !isResizingOther &&
              !draggingOther &&
              "hover:z-10 hover:bg-neutral-800",
            dragging ? "opacity-50" : "opacity-100",
          )}
        >
          <div
            className="absolute inset-x-0 top-0 h-1 cursor-ns-resize"
            onMouseDown={handleResizeStartFromEventStart}
          />
          <DateEventCardContent event={event} />
          <div
            className="absolute inset-x-0 bottom-0 h-1 cursor-ns-resize"
            onMouseDown={handleResizeStartFromEventEnd}
          />
        </DateEventCardBase>
      </EventPopover>
    );
  },
);
