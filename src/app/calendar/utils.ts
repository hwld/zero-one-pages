// TODO:
import { isWithinInterval, min, max } from "date-fns";

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
