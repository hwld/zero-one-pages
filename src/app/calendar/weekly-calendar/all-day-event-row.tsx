import { CalendarEvent } from "../monthly-calendar/calendar-event";
import { getExceededEventCountByDayOfWeek } from "../monthly-calendar/utils";
import { WeekEvent } from "../type";
import { CELL_Y_MARGIN } from "./all-day-event-cell";
import { EVENT_MIN_HEIGHT } from "./utils";
import { DAY_TITLE_HEIGHT } from "./weekly-calendar-header";

export const ALL_DAY_EVENT_DISPLAY_LIMIT = 2;

type Props = {
  week: Date[];
  weekAllDayEvents: WeekEvent[];
  isDraggingDate: boolean;
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
};

export const AllDayEventRow: React.FC<Props> = ({
  week,
  weekAllDayEvents,
  isDraggingDate,
  expanded,
  onExpandChange,
}) => {
  const exceededEvents = getExceededEventCountByDayOfWeek({
    weekEvents: weekAllDayEvents,
    limit: ALL_DAY_EVENT_DISPLAY_LIMIT,
  });

  const visibleWeekAllDayEvents = weekAllDayEvents.filter((e) => {
    if (expanded) {
      return true;
    }
    return e.top < ALL_DAY_EVENT_DISPLAY_LIMIT;
  });

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 col-start-2 w-full"
      style={{ top: DAY_TITLE_HEIGHT + CELL_Y_MARGIN }}
    >
      {visibleWeekAllDayEvents.map((event) => {
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
      {expanded
        ? null
        : week.map((date) => {
            const weekDay = date.getDay();
            const count = exceededEvents.get(weekDay);
            if (!count) {
              return null;
            }

            return (
              <CalendarEvent
                key={weekDay}
                height={EVENT_MIN_HEIGHT}
                isDraggingDate={isDraggingDate}
                top={ALL_DAY_EVENT_DISPLAY_LIMIT}
                startWeekDay={weekDay}
                range={1}
                onClick={() => {
                  onExpandChange(true);
                }}
              >
                <div className="flex h-full w-full items-center rounded px-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-900/10">
                  他<span className="mx-1">{count}</span>件
                </div>
              </CalendarEvent>
            );
          })}
    </div>
  );
};
