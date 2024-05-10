import { ComponentPropsWithoutRef, forwardRef, useState, useRef } from "react";
import { EventPopover } from "../../event-popover";
import { WeekEvent } from "../../type";
import { WeekEventCardBase, WeekEventCardContent } from "./base";

type Props = {
  height: number;
  disablePointerEvents: boolean;
  isDragging?: boolean;
  weekEvent: WeekEvent;
  topMargin?: number;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const WeekEventCard = forwardRef<HTMLButtonElement, Props>(
  function WeekEventCard(
    {
      height,
      disablePointerEvents,
      isDragging = false,
      weekEvent,
      topMargin,
      onMouseDown,
      onMouseMove,
      onClick,
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
        >
          <WeekEventCardContent weekEvent={weekEvent} isDragging={isDragging} />
        </WeekEventCardBase>
      </EventPopover>
    );
  },
);
