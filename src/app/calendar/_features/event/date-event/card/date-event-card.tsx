import {
  DragEvent,
  SyntheticEvent,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { ResizeDateEventPreview } from "../type";
import { DateEvent } from "../type";
import { calcDateEventCardStyle } from "../utils";
import clsx from "clsx";
import { DateEventCardBase, DateEventCardContent } from "./base";
import { EventPopover } from "../../event-popover";

export type DateEventCardProps = {
  // 一つのイベントが複数の日にまたがる可能性があるので、どの日のイベントを表示するのかを指定する
  displayedDate: Date;
  event: DateEvent;

  isDragging: boolean;
  isOtherEventDragging: boolean;
  onDragStart: (e: React.DragEvent, event: DateEvent) => void;

  isResizing: boolean;
  isOtherEventResizing: boolean;
  onStartResize: (
    e: React.MouseEvent,
    params: { event: DateEvent; origin: ResizeDateEventPreview["origin"] },
  ) => void;
};

export const DateEventCard = forwardRef<HTMLButtonElement, DateEventCardProps>(
  function DateEventCard(
    {
      event,
      displayedDate,
      isOtherEventDragging,
      onDragStart,
      isDragging,
      isOtherEventResizing,
      isResizing,
      onStartResize,
    },
    ref,
  ) {
    const isInteractive = !isOtherEventDragging && !isOtherEventResizing;

    const style = useMemo(() => {
      const base = calcDateEventCardStyle({ event, displayedDate });

      if (isResizing) {
        return { ...base, width: "100%", left: 0 };
      }

      return calcDateEventCardStyle({ event, displayedDate });
    }, [displayedDate, event, isResizing]);

    const handleResizeStartFromEventStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize(e, { event, origin: "eventEnd" });
    };

    const handleResizeStartFromEventEnd = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize(e, { event, origin: "eventStart" });
    };

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const isClick = useRef(false);
    const handleMouseDown = (e: SyntheticEvent) => {
      isClick.current = true;
      e.stopPropagation();
    };

    const handleMouseMove = () => {
      isClick.current = false;
    };

    const handleClick = () => {
      if (!isClick.current) {
        return;
      }
      setIsPopoverOpen(true);
    };

    const handleDragStart = (e: React.DragEvent) => {
      onDragStart(e, event);
    };

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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onDragStart={handleDragStart}
          style={style}
          className={clsx(
            isDragging && "opacity-50",
            isInteractive && "hover:z-20 hover:bg-neutral-900",
            isResizing && "z-30",
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
