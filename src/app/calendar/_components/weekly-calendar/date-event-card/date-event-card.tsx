import {
  DragEvent,
  SyntheticEvent,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { DateEvent, ResizeEventPreview } from "../../../type";
import {
  calcDateEventCardStyle,
  getHeightFromInterval,
  getTopFromDate,
} from "../utils";
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

  isSomeEventResizing: boolean;
  resizeEventPreview: ResizeEventPreview | undefined;
  onStartResize: (
    e: React.MouseEvent,
    params: { event: DateEvent; origin: ResizeEventPreview["origin"] },
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
      isSomeEventResizing,
      resizeEventPreview,
      onStartResize,
    },
    ref,
  ) {
    const isResizing = isSomeEventResizing
      ? resizeEventPreview?.id === event.id
      : false;
    const isOtherEventResizing = isSomeEventResizing ? !isResizing : false;

    const isInteractive = !draggingOther && !isOtherEventResizing;

    const style = useMemo(() => {
      if (isSomeEventResizing && resizeEventPreview?.id === event.id) {
        const top = getTopFromDate(resizeEventPreview, displayedDate);
        const height = getHeightFromInterval(resizeEventPreview, displayedDate);
        return { top, height, width: "100%" };
      }

      if (!isSomeEventResizing && resizeEventPreview?.id === event.id) {
        return calcDateEventCardStyle({
          event: resizeEventPreview,
          displayedDate,
        });
      }

      return calcDateEventCardStyle({ event, displayedDate });
    }, [displayedDate, event, isSomeEventResizing, resizeEventPreview]);

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
            isInteractive && "hover:z-10 hover:bg-neutral-800",
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
