import { CalendarEvent } from "../monthly-calendar/calendar-event";
import { getWeekEvents } from "../monthly-calendar/utils";
import { Event } from "../type";
import { CELL_Y_MARGIN } from "./all-day-event-cell";
import { EVENT_MIN_HEIGHT } from "./utils";
import { DAY_TITLE_HEIGHT } from "./weekly-calendar-header";

type Props = { week: Date[]; allDayEvents: Event[]; isDraggingDate: boolean };

export const AllDayEventRow: React.FC<Props> = ({
  week,
  allDayEvents,
  isDraggingDate,
}) => {
  const weekAllDayEvents = getWeekEvents({ week, events: allDayEvents });

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 col-start-2 w-full"
      style={{ top: DAY_TITLE_HEIGHT + CELL_Y_MARGIN }}
    >
      {weekAllDayEvents.map((event) => {
        return (
          <CalendarEvent
            key={event.id}
            height={EVENT_MIN_HEIGHT}
            isDraggingDate={isDraggingDate}
            top={event.top}
            startWeekDay={event.startWeekDay}
            range={event.endWeekDay - event.startWeekDay + 1}
          >
            <div className="flex h-full select-none items-center rounded bg-neutral-700 px-1 text-xs transition-colors hover:bg-neutral-800">
              {event.title}
            </div>
          </CalendarEvent>
        );
      })}
    </div>
  );
};
