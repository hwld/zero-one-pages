import { z } from "zod";

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  allDay: z.boolean(),
  start: z.coerce.date(),
  end: z.coerce.date(),
});
export type Event = z.infer<typeof eventSchema>;

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
