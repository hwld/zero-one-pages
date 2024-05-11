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
