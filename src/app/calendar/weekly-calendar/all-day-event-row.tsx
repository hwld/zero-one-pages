import {
  MoreWeekEventsCard,
  WeekEventCard,
} from "../monthly-calendar/week-event-card";
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
    week,
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
          <WeekEventCard
            key={event.id}
            weekEvent={event}
            height={EVENT_MIN_HEIGHT}
            disablePointerEvents={isDraggingDate}
          />
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
              <MoreWeekEventsCard
                key={weekDay}
                count={count}
                limit={ALL_DAY_EVENT_DISPLAY_LIMIT}
                height={EVENT_MIN_HEIGHT}
                disablePointerEvents={isDraggingDate}
                weekDay={weekDay}
                onClick={() => onExpandChange(true)}
              />
            );
          })}
    </div>
  );
};
