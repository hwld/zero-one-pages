// TODO:
import { isWithinInterval, min, max } from "date-fns";
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
