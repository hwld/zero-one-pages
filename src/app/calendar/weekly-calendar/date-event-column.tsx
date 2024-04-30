import { DragEvent, RefObject } from "react";
import {
  DateEvent,
  DateEvent as DateEventData,
  DraggingDateEvent,
  Event,
} from "../type";
import { getDateEvents, getHeightFromDate, getTopFromDate } from "./utils";
import { DateEventCard } from "./date-event-card";

export const EVENT_DRAG_TYPE = "application/event";

type Props = {
  dateColumnRef: RefObject<HTMLDivElement>;
  date: Date;
  events: Event[];
  draggingEvent: DraggingDateEvent | undefined;
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    dateEvent: DateEventData,
  ) => void;
  onDragEnd: () => void;
  onEventUpdate: (event: DateEvent) => void;
};

export const DateEventColumn: React.FC<Props> = ({
  dateColumnRef,
  date,
  events,
  draggingEvent,
  onDragStart,
  onDragEnd,
  onEventUpdate,
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
        dateColumnRef={dateColumnRef}
        key={event.id}
        event={event}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onEventUpdate={onEventUpdate}
        style={{
          top,
          height,
          left: `${left}%`,
          width: `${width}%`,
        }}
        dragging={event.id === draggingEvent?.id}
      />
    );
  });
};
