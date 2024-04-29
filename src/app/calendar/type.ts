import { z } from "zod";

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
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
export type WeekEvent = z.infer<typeof weekEventSchema>;

export const dateEventSchema = eventSchema.merge(
  z.object({
    prevOverlappings: z.number(),
    totalOverlappings: z.number(),
  }),
);
export type DateEvent = z.infer<typeof dateEventSchema>;

export type DraggingDateEvent = DateEvent & { dragStartY: number };
