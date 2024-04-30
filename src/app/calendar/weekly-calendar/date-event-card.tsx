import {
  ComponentPropsWithoutRef,
  DragEvent,
  RefObject,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { DateEvent } from "../type";
import { formatEventDateSpan, getDateFromY } from "./utils";
import { cn } from "@/lib/utils";
import { isAfter, isBefore, isSameMinute } from "date-fns";
import clsx from "clsx";

const DateEventCardBase = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function DateEventCardBase({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute flex select-none flex-col justify-start overflow-hidden rounded border border-neutral-500 bg-neutral-700 px-1 pt-[1px] text-neutral-100 transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const DateEventCardContent: React.FC<{ event: DateEvent }> = ({ event }) => {
  return (
    <>
      <div className="text-xs">{event.title}</div>
      <div className="text-xs">{formatEventDateSpan(event)}</div>
    </>
  );
};

export const PreviewDateEventCard = forwardRef<
  HTMLDivElement,
  {
    event: DateEvent | undefined;
    visible: boolean;
    top?: string;
    height?: string;
  }
>(function PreviewDateEventCard({ event, visible, top, height }, ref) {
  return (
    <DateEventCardBase
      ref={ref}
      className={clsx(
        "pointer-events-none z-20 w-full",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        top,
        height,
      }}
    >
      {event && <DateEventCardContent event={event} />}
    </DateEventCardBase>
  );
});

type DateEventCardProps = {
  dateColumnRef?: RefObject<HTMLDivElement>;
  event: DateEvent;
  dragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, event: DateEvent) => void;
  onDragEnd: () => void;
  onEventUpdate: (event: DateEvent) => void;
  style: { top: number; height: number; left: string; width: string };
};

export const DateEventCard = forwardRef<HTMLDivElement, DateEventCardProps>(
  function DateEventCard(
    {
      event,
      dragging,
      dateColumnRef,
      onEventUpdate,
      onDragStart,
      onDragEnd,
      style,
    },
    ref,
  ) {
    const [resizeOrigin, setResizeOrigin] = useState<
      "eventStart" | "eventEnd" | undefined
    >(undefined);
    const isResizing = resizeOrigin !== undefined;

    const handleResizeStartFromEventStart = (
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      setResizeOrigin("eventEnd");
    };

    const handleResizeStartFromEventEnd = (
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      setResizeOrigin("eventStart");
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!dateColumnRef?.current || !resizeOrigin) {
          return;
        }

        const y = e.clientY - dateColumnRef.current.getBoundingClientRect().y;
        if (y < 0) {
          return;
        }
        const date = getDateFromY(event.start, y);

        switch (resizeOrigin) {
          case "eventStart": {
            if (isSameMinute(event.start, date)) {
              return;
            }

            if (isBefore(date, event.start)) {
              onEventUpdate({ ...event, start: date });
              setResizeOrigin("eventEnd");
            } else {
              onEventUpdate({ ...event, end: date });
            }
            return;
          }
          case "eventEnd": {
            if (isSameMinute(event.end, date)) {
              return;
            }

            if (isAfter(date, event.end)) {
              onEventUpdate({ ...event, end: date });
              setResizeOrigin("eventStart");
            } else {
              onEventUpdate({ ...event, start: date });
            }
            return;
          }
          default: {
            throw new Error(resizeOrigin satisfies never);
          }
        }
      };

      const handleMouseUp = () => {
        if (resizeOrigin) {
          setResizeOrigin(undefined);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dateColumnRef, event, onEventUpdate, resizeOrigin]);

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
        onDragEnd={onDragEnd}
        style={{
          top: style.top,
          left: isResizing ? "0" : style.left,
          height: style.height,
          width: isResizing ? "100%" : style.width,
        }}
        className={clsx(
          "hover:z-10 hover:bg-neutral-800",
          isResizing && "z-20 bg-neutral-800",
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
