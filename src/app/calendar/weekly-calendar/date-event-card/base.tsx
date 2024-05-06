import { ComponentPropsWithoutRef, forwardRef } from "react";
import { DateEvent } from "../../type";
import { formatEventDateSpan } from "../utils";
import { cn } from "@/lib/utils";

export const DateEventCardBase = forwardRef<
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

export const DateEventCardContent: React.FC<{ event: DateEvent }> = ({
  event,
}) => {
  return (
    <>
      <div className="text-xs">{event.title}</div>
      <div className="text-xs">{formatEventDateSpan(event)}</div>
    </>
  );
};
