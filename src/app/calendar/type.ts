import { z } from "zod";
import { eventSchema, Event } from "./_mocks/event-store";

export const weekEventSchema = eventSchema.merge(
  z.object({
    top: z.number(),
    startWeekDay: z.number(),
    endWeekDay: z.number(),
  }),
);
export type WeekEvent = Event & {
  top: number;
  startWeekDay: number;
  endWeekDay: number;
};

export type DateEvent = Event & {
  prevOverlappings: number;
  totalOverlappings: number;
};

export type DraggingDateEvent = DateEvent & {
  prevMouseOverDate: Date;
};

export type ResizingDateEvent = DateEvent & {
  origin: "eventStart" | "eventEnd";
};
