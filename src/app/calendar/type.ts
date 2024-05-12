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

// TODO: weekly-calendarでしかつかってない。
export type MoveEventPreview = DateEvent & {
  prevMouseOverDate: Date;
  updatedAt: number;
};

export type ResizeEventPreview = DateEvent & {
  origin: "eventStart" | "eventEnd";
  updatedAt: number;
};
