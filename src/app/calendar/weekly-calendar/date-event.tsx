import { ComponentPropsWithoutRef, forwardRef } from "react";
import { DateEvent } from "../type";
import { formatEventDateSpan } from "./utils";
import { cn } from "@/lib/utils";

type Props = { event?: DateEvent } & ComponentPropsWithoutRef<"div">;
export const DateEventCard = forwardRef<HTMLDivElement, Props>(
  function DateEventCard({ event, className, ...props }, ref) {
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
      </div>
    );
  },
);
