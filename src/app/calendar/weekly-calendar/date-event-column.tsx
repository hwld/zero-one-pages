import { Event } from "../type";
import { getDateEvents, getHeightFromDate, getTopFromDate } from "./utils";

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
      <button
        key={event.id}
        draggable
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="absolute rounded border border-neutral-500 bg-neutral-700 transition-colors hover:bg-neutral-800"
        style={{
          top,
          height,
          left: `${left}%`,
          width: `${width}%`,
        }}
      >
        {event.title}
      </button>
    );
  });
};
