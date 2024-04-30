import {
  ComponentPropsWithoutRef,
  RefObject,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { DateEvent } from "../type";
import { formatEventDateSpan, getDateFromY } from "./utils";
import { cn } from "@/lib/utils";
import { isAfter, isBefore, isSameMinute } from "date-fns";

// TODO: dropPreviewのためにeventがnullableになってるのをどうにかする
type Props = {
  dateColumnRef?: RefObject<HTMLDivElement>;
  event?: DateEvent;
  onEventUpdate?: (event: DateEvent) => void;
} & ComponentPropsWithoutRef<"div">;

export const DateEventCard = forwardRef<HTMLDivElement, Props>(
  function DateEventCard(
    { event, dateColumnRef, onEventUpdate, className, ...props },
    ref,
  ) {
    const [resizeOrigin, setResizeOrigin] = useState<
      "eventStart" | "eventEnd" | undefined
    >(undefined);

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
        if (!dateColumnRef?.current || !resizeOrigin || !event) {
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
              onEventUpdate?.({ ...event, start: date });
              setResizeOrigin("eventEnd");
            } else {
              onEventUpdate?.({ ...event, end: date });
            }
            return;
          }
          case "eventEnd": {
            if (isSameMinute(event.end, date)) {
              return;
            }

            if (isAfter(date, event.end)) {
              onEventUpdate?.({ ...event, end: date });
              setResizeOrigin("eventStart");
            } else {
              onEventUpdate?.({ ...event, start: date });
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
      <div
        ref={ref}
        draggable
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className={cn(
          "absolute flex select-none flex-col justify-start overflow-hidden rounded border border-neutral-500 bg-neutral-700 px-1 pt-[1px] text-neutral-100 transition-colors hover:z-10 hover:bg-neutral-800",
          className,
        )}
        {...props}
      >
        {event && (
          <>
            <div className="text-xs">{event.title}</div>
            <div className="text-xs">{formatEventDateSpan(event)}</div>
          </>
        )}
        <div
          className="absolute inset-x-0 top-0 h-1 cursor-ns-resize"
          onMouseDown={handleResizeStartFromEventStart}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1 cursor-ns-resize"
          onMouseDown={handleResizeStartFromEventEnd}
        ></div>
      </div>
    );
  },
);
