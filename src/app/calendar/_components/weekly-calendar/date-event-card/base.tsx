import { ComponentPropsWithoutRef, forwardRef } from "react";
import { DateEvent } from "../../../type";
import { formatEventDateSpan } from "../utils";
import { cn } from "@/lib/utils";

export const DateEventCardBase = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function DateEventCardBase({ className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "absolute flex select-none flex-col justify-start overflow-hidden rounded border border-neutral-500 bg-neutral-700 px-1 pt-[1px] text-neutral-100 ring-blue-500 transition-colors focus-visible:outline-none focus-visible:ring",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export const DateEventCardContent: React.FC<{ event: DateEvent }> = ({
  event,
}) => {
  return (
    <>
      <div className="text-xs">{event.title}</div>
      <div className="text-xs text-neutral-300">
        {formatEventDateSpan(event)}
      </div>
    </>
  );
};
