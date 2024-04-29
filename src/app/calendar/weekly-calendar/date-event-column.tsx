import { DateEvent, Event } from "../type";
import { getDateEvents, getHeightFromDate, getTopFromDate } from "./utils";
import { format, getHours } from "date-fns";

type Props = { date: Date; events: Event[] };
export const DateEventColumn: React.FC<Props> = ({ date, events }) => {
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
      <div
        key={event.id}
        draggable
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
        }}
        className="absolute flex select-none flex-col justify-start overflow-hidden rounded border border-neutral-500 bg-neutral-700 px-1 pt-[1px] text-neutral-100 transition-colors hover:bg-neutral-800"
        style={{
          top,
          height,
          left: `${left}%`,
          width: `${width}%`,
        }}
      >
        <div className="text-xs">{event.title}</div>
        <div className="text-xs">{formatEventDateSpan(event)}</div>
      </div>
    );
  });
};

const isSameAmPm = (date1: Date, date2: Date) => {
  const h1 = getHours(date1);
  const h2 = getHours(date2);
  const isAm1 = h1 >= 0 && h1 < 12;
  const isAm2 = h2 >= 0 && h2 < 12;
  return isAm1 === isAm2;
};

const formatEventDateSpan = (event: DateEvent) => {
  if (isSameAmPm(event.start, event.end)) {
    return `${format(event.start, "h:mm")}~${format(event.end, "h:mm a")}`;
  }
  return `${format(event.start, "h:mm a")}~${format(event.end, "h:mm a")}`;
};
