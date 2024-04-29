import { DragEvent } from "react";
import { DateEvent as DateEventData, DraggingDateEvent, Event } from "../type";
import { getDateEvents, getHeightFromDate, getTopFromDate } from "./utils";
import { DateEventCard } from "./date-event";
import clsx from "clsx";

export const EVENT_DRAG_TYPE = "application/event";

type Props = {
  date: Date;
  events: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    dateEvent: DateEventData,
  ) => void;
  onDragEnd: () => void;
};

export const DateEventColumn: React.FC<Props> = ({
  date,
  events,
  draggingEvent,
  onDragStart,
  onDragEnd,
}) => {
  const dateEvents = getDateEvents({ date, events });

  return dateEvents.map((event) => {
    const top = getTopFromDate(event.start);
    const height = getHeightFromDate({
      start: event.start,
      end: event.end,
    });

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

    return (
      <DateEventCard
        key={event.id}
        event={event}
        onDragStart={(e) => {
          onDragStart(e, event);
        }}
        onDragEnd={onDragEnd}
        style={{
          top,
          height,
          left: `${left}%`,
          width: `${width}%`,
        }}
        className={clsx(
          event.id === draggingEvent?.id ? "opacity-50" : "opacity-100",
        )}
      />
    );
  });
};
