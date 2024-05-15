// TODO:
import {
  isWithinInterval,
  min,
  max,
  differenceInDays,
  addDays,
  areIntervalsOverlapping,
  startOfDay,
  endOfDay,
  AreIntervalsOverlappingOptions,
  Interval,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  lastDayOfMonth,
  startOfWeek,
} from "date-fns";
import { Event } from "../_mocks/event-store";

export type DragDateRange = {
  dragStartDate: Date;
  dragEndDate: Date;
};

export const isDayWithinDragDateRange = (
  yearMonthDay: Date,
  range: DragDateRange,
) => {
  const dragStart = startOfDay(range.dragStartDate);
  const dragEnd = startOfDay(range.dragEndDate);

  return isWithinInterval(yearMonthDay, {
    start: startOfDay(min([dragStart, dragEnd])),
    end: endOfDay(max([dragStart, dragEnd])),
  });
};

export const areDragDateRangeOverlapping = (
  date: Date,
  range: DragDateRange,
) => {
  return areIntervalsOverlapping(
    { start: startOfDay(date), end: endOfDay(date) },
    { start: range.dragStartDate, end: range.dragEndDate },
  );
};

// TODO: rename
export type DraggingEvent = {
  event: Event;
} & DragDateRange;

export const getEventFromDraggingEvent = (
  draggingEvent: DraggingEvent,
): Event => {
  const { event, dragStartDate, dragEndDate } = draggingEvent;
  const diffDay = differenceInDays(dragEndDate, dragStartDate);

  const newStart = addDays(event.start, diffDay);
  const newEnd = addDays(event.end, diffDay);

  return { ...event, start: newStart, end: newEnd };
};

export const getOverlappingDates = (
  a: Interval,
  b: Interval,
  options?: AreIntervalsOverlappingOptions,
) => {
  if (areIntervalsOverlapping(a, b, options)) {
    const start = a.start > b.start ? a.start : b.start;
    const end = a.end < b.end ? a.end : b.end;
    return eachDayOfInterval({ start, end });
  } else {
    return [];
  }
};

export const getCalendarDates = ({
  year,
  month: _month,
}: {
  year: number;
  month: number;
}): Date[][] => {
  const month = _month - 1;
  const firstDay = new Date(year, month, 1);
  const lastDay = lastDayOfMonth(new Date(year, month));

  // 7日ごとに日付をまとめる
  const calendarWeekStarts = eachWeekOfInterval({
    start: startOfWeek(firstDay),
    end: endOfWeek(lastDay),
  });
  const calendar = calendarWeekStarts.map((weekStart) => {
    return eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(weekStart),
    });
  });

  return calendar;
};

export type MouseHistory = { prevY: number; prevScrollTop: number };
