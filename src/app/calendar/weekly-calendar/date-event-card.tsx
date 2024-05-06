import {
  ComponentPropsWithoutRef,
  DragEvent,
  forwardRef,
  useMemo,
} from "react";
import { DateEvent, ResizingDateEventState } from "../type";
import {
  formatEventDateSpan,
  getHeightFromInterval,
  getTopFromDate,
} from "./utils";
import { cn } from "@/lib/utils";
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
    date: Date;
    event: DateEvent | undefined;
    visible: boolean;
  }
>(function PreviewDateEventCard({ date, event, visible }, ref) {
  const style = useMemo(() => {
    const top = event && getTopFromDate(event, date);
    const height = event && getHeightFromInterval(event, date);

    return { top, height };
  }, [date, event]);

  return (
    <DateEventCardBase
      ref={ref}
      className={clsx(
        "pointer-events-none z-20 w-full bg-neutral-800 ring ring-blue-500",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={style}
    >
      {event && <DateEventCardContent event={event} />}
    </DateEventCardBase>
  );
});

type DateEventCardProps = {
  // 一つのイベントが複数の日にまたがる可能性があるので、どの日のイベントを表示するのかを指定する
  displayedDate: Date;
  event: DateEvent;
  dragging: boolean;
  draggingOther: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, event: DateEvent) => void;
  isResizing: boolean;
  isResizingOther: boolean;
  onChangeResizingEventState: (
    state: ResizingDateEventState | undefined,
  ) => void;
};

export const DateEventCard = forwardRef<HTMLDivElement, DateEventCardProps>(
  function DateEventCard(
    {
      event,
      displayedDate,
      dragging,
      draggingOther,
      onDragStart,
      isResizing,
      isResizingOther,
      onChangeResizingEventState,
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

      onChangeResizingEventState({ event, origin: "eventEnd" });
    };

    const handleResizeStartFromEventEnd = (
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      onChangeResizingEventState({ event, origin: "eventStart" });
    };

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
        style={{
          top: style.top,
          left: isResizing ? "0" : style.left,
          height: style.height,
          width: isResizing ? "100%" : style.width,
        }}
        className={clsx(
          !isResizingOther &&
            !draggingOther &&
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
