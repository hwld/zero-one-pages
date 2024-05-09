// TODO:
import {
  addMinutes,
  startOfDay,
  Interval,
  differenceInMinutes,
  areIntervalsOverlapping,
  format,
  getHours,
  endOfDay,
  max,
  min,
  differenceInHours,
} from "date-fns";
import { DateEvent } from "../type";
import { Event } from "../mocks/event-store";

export type MouseHistory = { prevY: number; prevScrollTop: number };

export const EVENT_MIN_HEIGHT = 17;
export const EVENT_MIN_MINUTES = 15;

/**
 * 年月日とweekly calendar上のy軸から日付を取得する
 * @param y 0を00時00分としたときの数値
 */
export const getDateFromY = (
  yearMonthDate: Date,
  y: number,
  roundingOption: "floor" | "round" = "round",
): Date => {
  const roundingMethod = Math[roundingOption];

  const date = addMinutes(
    startOfDay(yearMonthDate),
    roundingMethod(y / EVENT_MIN_HEIGHT) * EVENT_MIN_MINUTES,
  );
  return date;
};

/**
 *  指定した期間がweekly calendar上で指定された日付に表示されるtopを取得する
 */
export const getTopFromDate = (
  interval: { start: Date; end: Date },
  day: Date,
): number => {
  if (startOfDay(day).getTime() > interval.start.getTime()) {
    return 0;
  }

  const top =
    Math.floor(
      (interval.start.getHours() * 60 + interval.start.getMinutes()) /
        EVENT_MIN_MINUTES,
    ) * EVENT_MIN_HEIGHT;

  return top;
};

/**
 * 指定した期間がweekly calendar上で指定された日付に表示されるheightを取得する
 */
export const getHeightFromInterval = (
  interval: Interval,
  day: Date,
): number => {
  const startDay = startOfDay(day);
  const endDay = endOfDay(day);

  // intervalの範囲外のときは0
  if (!areIntervalsOverlapping(interval, { start: startDay, end: endDay })) {
    return 0;
  }

  // 指定された日付の範囲にあるintervalを取得する
  const start = max([startDay, interval.start]);
  const end = min([endDay, interval.end]);

  const height =
    Math.ceil(differenceInMinutes(end, start) / EVENT_MIN_MINUTES) *
    EVENT_MIN_HEIGHT;

  return height;
};

export const getDateEvents = ({
  date,
  events,
}: {
  date: Date;
  events: Event[];
}): DateEvent[] => {
  const sortedEvents = events
    .filter((event) =>
      areIntervalsOverlapping(
        { start: startOfDay(date), end: endOfDay(date) },
        event,
      ),
    )
    .sort((event1, event2) => {
      if (event1.start.getTime() > event2.start.getTime()) {
        return 1;
      }
      if (event1.start.getTime() < event2.start.getTime()) {
        return -1;
      }
      return (
        differenceInMinutes(event2.end, event2.start) -
        differenceInMinutes(event1.end, event1.start)
      );
    });

  const dateEvents: (Omit<DateEvent, "totalOverlappings"> & {
    totalOverlappingsList: number[];
  })[] = [];

  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    const prevEvents = dateEvents.filter((_, index) => index < i);

    const overlappingEvents = [];
    let prevOverlappings = 0;
    for (let prevEvent of prevEvents) {
      if (
        areIntervalsOverlapping(event, prevEvent) &&
        isShortInterval(event.start, prevEvent.start)
      ) {
        overlappingEvents.push(prevEvent);
        prevOverlappings++;
      }
    }

    overlappingEvents.forEach((e) =>
      e.totalOverlappingsList.push(prevOverlappings),
    );

    dateEvents.push({
      ...event,
      prevOverlappings,
      totalOverlappingsList: [prevOverlappings],
    });
  }

  return dateEvents.map((event) => ({
    ...event,
    totalOverlappings: Math.max(...event.totalOverlappingsList),
  }));
};

const isShortInterval = (left: Date, right: Date) => {
  return Math.abs(differenceInMinutes(left, right)) < 30;
};

export const isSameAmPm = (date1: Date, date2: Date) => {
  const h1 = getHours(date1);
  const h2 = getHours(date2);
  const isAm1 = h1 >= 0 && h1 < 12;
  const isAm2 = h2 >= 0 && h2 < 12;
  return isAm1 === isAm2;
};

export const formatEventDateSpan = (event: DateEvent) => {
  if (isSameAmPm(event.start, event.end)) {
    return `${format(event.start, "h:mm")}~${format(event.end, "h:mm a")}`;
  }
  return `${format(event.start, "h:mm a")}~${format(event.end, "h:mm a")}`;
};

type SplitEventResult = {
  /**
   * 終日イベントと期間が24時間を超えるイベント
   */
  longTermEvents: Event[];
  defaultEvents: Event[];
};

export const splitEvent = (events: Event[]): SplitEventResult => {
  const longTermEvents: Event[] = [];
  const defaultEvents: Event[] = [];

  events.forEach((event) => {
    if (event.allDay || differenceInHours(event.end, event.start) > 24) {
      longTermEvents.push(event);
      return;
    }

    defaultEvents.push(event);
    return;
  });

  return { longTermEvents, defaultEvents };
};
