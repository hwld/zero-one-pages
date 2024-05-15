import {
  areIntervalsOverlapping,
  startOfDay,
  endOfDay,
  differenceInCalendarDays,
  eachDayOfInterval,
  isWithinInterval,
  addDays,
  differenceInDays,
} from "date-fns";
import { MoveWeekEventPreview, WeekEvent } from "./type";
import { Event } from "../../../_mocks/event-store";
import { getOverlappingDates } from "../../../utils";

export const getWeekEvents = ({
  week,
  events,
}: {
  week: Date[];
  events: Event[];
}): WeekEvent[] => {
  const sortedEvents = events
    .filter((event) => {
      const overlapping = areIntervalsOverlapping(
        { start: startOfDay(week[0]), end: endOfDay(week[week.length - 1]) },
        event,
        { inclusive: true },
      );

      return overlapping;
    })
    .sort((event1, event2) => {
      const startTime1 = event1.start.getTime();
      const startTime2 = event2.start.getTime();
      if (startTime1 < startTime2) {
        return -1;
      }
      if (startTime2 > startTime1) {
        return 1;
      }

      const range1 = differenceInCalendarDays(event1.end, event1.start);
      const range2 = differenceInCalendarDays(event2.end, event2.start);
      if (range1 > range2) {
        return -1;
      }
      if (range2 > range1) {
        return 1;
      }

      return 0;
    });

  const weekEvents: WeekEvent[] = [];
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];

    // イベントよりも前に存在している重複したイベントを取得する
    const prevOverlappingEvents = weekEvents.filter((prevEvent, index) => {
      const overlapping = areIntervalsOverlapping(
        { start: startOfDay(event.start), end: startOfDay(event.end) },
        { start: startOfDay(prevEvent.start), end: startOfDay(prevEvent.end) },
        {
          inclusive: true,
        },
      );
      return overlapping && index < i;
    });

    // 使用されているtopを取得する
    const dates = eachDayOfInterval(event);
    const invalidTops = dates.flatMap((date) => {
      return prevOverlappingEvents
        .map((prevEvent) => {
          if (
            isWithinInterval(date, {
              start: startOfDay(prevEvent.start),
              end: startOfDay(prevEvent.end),
            })
          ) {
            return prevEvent.top;
          }
          return undefined;
        })
        .filter((top): top is number => top !== undefined);
    });
    const invalidTopSet = new Set(invalidTops);

    // topを求める
    let top = 0;
    for (let i = 0; i < Number.MAX_VALUE; i++) {
      if (!invalidTopSet.has(i)) {
        top = i;
        break;
      }
    }

    const weekEvent = convertEventToWeekEvent(event, { top, week });
    if (weekEvent) {
      weekEvents.push(weekEvent);
    }
  }

  return weekEvents;
};

export const convertEventToWeekEvent = (
  event: Event,
  { top, week }: { top: number; week: Date[] },
): WeekEvent | undefined => {
  if (!week.length) {
    return undefined;
  }

  const eventDatesInWeek = getOverlappingDates(
    {
      start: startOfDay(week.at(0)!),
      end: endOfDay(week.at(-1)!),
    },
    event,
    { inclusive: true },
  );

  if (!eventDatesInWeek.length) {
    return undefined;
  }

  const weekEvent: WeekEvent = {
    ...event,
    top,
    startWeekDay: eventDatesInWeek.at(0)!.getDay(),
    endWeekDay: eventDatesInWeek.at(-1)!.getDay(),
  };

  return weekEvent;
};

/**
 * 特定の週で、表示できるイベントの上限数を超えているイベント数を数え、
 * 曜日をキー、超えているイベント数を値とするMapとして返す関数
 */
export const getExceededEventCountByDayOfWeek = ({
  week,
  weekEvents,
  limit,
}: {
  week: Date[];
  weekEvents: WeekEvent[];
  limit: number;
}) => {
  type WeekDay = number;
  type ExceededEventCount = number;

  return weekEvents
    .filter((event) => event.top >= limit)
    .flatMap((event) => {
      return eachDayOfInterval(event);
    })
    .reduce((map, date) => {
      // 複数の週にまたがるイベントでは、指定した週以外の日付も含まれるので、それを取り除く
      const isOutsideWeek = !isWithinInterval(date, {
        start: startOfDay(week[0]),
        end: endOfDay(week[week.length - 1]),
      });

      if (isOutsideWeek) {
        return map;
      }

      const weekDay = date.getDay();
      const overLimitEventCount = map.get(weekDay);

      if (overLimitEventCount !== undefined) {
        map.set(weekDay, overLimitEventCount + 1);
      } else {
        map.set(weekDay, 1);
      }
      return map;
    }, new Map<WeekDay, ExceededEventCount>());
};

export const getEventFromMoveEventPreview = (
  draggingEvent: MoveWeekEventPreview,
): Event => {
  const { dragStartDate, dragEndDate, ...event } = draggingEvent;
  const diffDay = differenceInDays(dragEndDate, dragStartDate);

  const newStart = addDays(event.start, diffDay);
  const newEnd = addDays(event.end, diffDay);

  return { ...event, start: newStart, end: newEnd };
};
