// TODO:
import {
  isWithinInterval,
  min,
  max,
  differenceInDays,
  addDays,
} from "date-fns";
import { Event } from "./type";

export type DragDateRange = {
  dragStartDate: Date;
  dragEndDate: Date;
};

export const isWithinDragDateRange = (date: Date, range: DragDateRange) => {
  const { dragStartDate, dragEndDate } = range;

  return isWithinInterval(date, {
    start: min([dragStartDate, dragEndDate]),
    end: max([dragStartDate, dragEndDate]),
  });
};

export type DragEvent = {
  event: Event;
} & DragDateRange;

export const getEventFromDragEvent = (dragEvent: DragEvent): Event => {
  const { event, dragStartDate, dragEndDate } = dragEvent;
  const diffDay = differenceInDays(dragEndDate, dragStartDate);

  const newStart = addDays(event.start, diffDay);
  const newEnd = addDays(event.end, diffDay);

  return { ...event, start: newStart, end: newEnd };
};
