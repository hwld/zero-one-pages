import { isSameDay } from "date-fns";
import { Event } from "../type";
import { getHeightFromDate, getTopFromDate } from "./utils";

type Props = { date: Date; events: Event[] };
export const DateEventColumn: React.FC<Props> = ({ date, events }) => {
  return events.map((event) => {
    if (!isSameDay(date, event.start)) {
      return null;
    }

    const top = getTopFromDate(event.start);
    const height = getHeightFromDate({
      start: event.start,
      end: event.end,
    });

    return (
      <div
        key={event.id}
        className="absolute w-[90%] rounded bg-neutral-700"
        style={{ top, height }}
      >
        {event.title}
      </div>
    );
  });
};
