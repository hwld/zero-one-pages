import { DragEvent, forwardRef, useMemo } from "react";
import { DateEvent } from "../../type";
import { getHeightFromInterval, getTopFromDate } from "../utils";
import clsx from "clsx";
import { DateEventCardBase, DateEventCardContent } from "./base";
import { ResizeEventActions } from "../use-resize-event";

type Props = {
  // 一つのイベントが複数の日にまたがる可能性があるので、どの日のイベントを表示するのかを指定する
  displayedDate: Date;
  event: DateEvent;
  dragging: boolean;
  draggingOther: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, event: DateEvent) => void;
  isResizing: boolean;
  hidden?: boolean;
  isResizingOther: boolean;
  resizeEventActions: ResizeEventActions;
};

export const DateEventCard = forwardRef<HTMLDivElement, Props>(
  function DateEventCard(
    {
      event,
      displayedDate,
      dragging,
      draggingOther,
      onDragStart,
      hidden = false,
      isResizingOther,
      resizeEventActions,
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

      resizeEventActions.startResize({ event, origin: "eventEnd" });
    };

    const handleResizeStartFromEventEnd = (
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      resizeEventActions.startResize({ event, origin: "eventStart" });
    };

    if (hidden) {
      return null;
    }

    return (
      <DateEventCardBase
        ref={ref}
        draggable
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
    );
  },
);
