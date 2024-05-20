import { ComponentPropsWithoutRef, forwardRef, useState, useRef } from "react";
import { WeekEventCardBase, WeekEventCardContent } from "./base";
import { ResizeWeekEventPreview, WeekEvent } from "../type";
import { EventPopover } from "../../event/event-popover";

export type WeekEventCardProps = {
  height: number;
  disablePointerEvents: boolean;
  weekEvent: WeekEvent;
  topMargin?: number;
  isDragging: boolean;
  onStartResize?: (
    e: React.MouseEvent,
    params: { event: WeekEvent; origin: ResizeWeekEventPreview["origin"] },
  ) => void;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const WeekEventCard = forwardRef<HTMLButtonElement, WeekEventCardProps>(
  function WeekEventCard(
    {
      height,
      disablePointerEvents,
      weekEvent,
      topMargin,
      onMouseDown,
      onMouseMove,
      onClick,
      isDragging,
      onStartResize,
      ...props
    },
    ref,
  ) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const isClick = useRef(false);
    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseDown?.(e);
      isClick.current = true;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseMove?.(e);
      isClick.current = false;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (isClick.current) {
        setIsPopoverOpen(true);
      }
    };

    const handleResizeStartFromEventStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize?.(e, { event: weekEvent, origin: "eventEnd" });
    };

    const handleResizeStartFromEventEnd = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize?.(e, { event: weekEvent, origin: "eventStart" });
    };

    return (
      <EventPopover
        event={weekEvent}
        isOpen={isPopoverOpen}
        onChangeOpen={setIsPopoverOpen}
      >
        <WeekEventCardBase
          ref={ref}
          height={height}
          disablePointerEvents={disablePointerEvents}
          top={weekEvent.top}
          startWeekDay={weekEvent.startWeekDay}
          range={weekEvent.endWeekDay - weekEvent.startWeekDay + 1}
          topMargin={topMargin}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          {...props}
          className={isDragging ? "opacity-50" : ""}
        >
          {weekEvent.allDay && (
            <div
              className="absolute inset-y-0 left-0 w-1 cursor-ew-resize"
              onMouseDown={handleResizeStartFromEventStart}
            />
          )}
          <WeekEventCardContent weekEvent={weekEvent} isDragging={false} />
          {weekEvent.allDay && (
            <div
              className="absolute inset-y-0 right-0 w-1 cursor-ew-resize rounded-r-full"
              onMouseDown={handleResizeStartFromEventEnd}
            />
          )}
        </WeekEventCardBase>
      </EventPopover>
    );
  },
);
