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
          left:
            event.prevOverlappings === 0
              ? 0
              : `calc(93% / ${event.totalOverlappings + 1} * ${
                  event.prevOverlappings
                })`,
          width:
            event.totalOverlappings === 0
              ? "93%"
              : `calc(93% * ${Math.pow(0.7, event.prevOverlappings + 1)})`,
        }}
      >
        {event.title}
      </button>
    );
  });
};
