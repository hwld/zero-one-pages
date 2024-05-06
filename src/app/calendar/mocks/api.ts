import { HttpResponse, delay, http } from "msw";
import { z } from "zod";
import { Event, eventSchema, eventStore } from "./event-store";
import { taskStore } from "@/app/todo-1/_mocks/task-store";
import { fetcher } from "@/lib/fetcher";

export const CalendarAPI = {
  base: "/calendar/api",
  events: () => `${CalendarAPI.base}/events`,
  event: (id?: string) => `${CalendarAPI.events()}/${id ?? ":id"}`,
};

export const createEventInputSchema = z.object({
  title: z.string().min(1).max(200),
  allDay: z
    .union([z.literal("true"), z.literal("false")])
    .transform((value) => {
      switch (value) {
        case "true": {
          return true;
        }
        case "false": {
          return false;
        }
        default: {
          throw new Error(value satisfies never);
        }
      }
    }),
  start: z.coerce.date(),
  end: z.coerce.date(),
});
export type CreateEventInput = z.infer<typeof createEventInputSchema>;

export const updateEventInputSchema = createEventInputSchema;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;

export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetcher.get(CalendarAPI.events());
  const json = await res.json();
  const events = z.array(eventSchema).parse(json);

  return events;
};

export const fetchEvent = async (id: string): Promise<Event> => {
  const res = await fetcher.get(CalendarAPI.event(id));
  const json = await res.json();
  const event = eventSchema.parse(json);

  return event;
};

export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  const res = await fetcher.post(CalendarAPI.events(), { body: input });
  const json = await res.json();
  const event = eventSchema.parse(json);

  return event;
};

export const updateEvent = async ({
  id,
  ...input
}: UpdateEventInput & { id: string }): Promise<Event> => {
  const res = await fetcher.put(CalendarAPI.event(id), { body: input });
  const json = await res.json();
  const event = eventSchema.parse(json);

  return event;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await fetcher.delete(CalendarAPI.event(id));
  return;
};

export const calendarApiHandlers = [
  http.get(CalendarAPI.events(), async () => {
    await delay();

    const events = eventStore.getAll();
    return HttpResponse.json(events);
  }),

  http.get(CalendarAPI.event(), async ({ params }) => {
    await delay();

    const id = z.string().parse(params.id);
    const event = eventStore.get(id);

    if (!event) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(event);
  }),

  http.post(CalendarAPI.events(), async ({ request }) => {
    await delay();

    const input = createEventInputSchema.parse(request);
    const createdEvent = eventStore.add(input);

    return HttpResponse.json(createdEvent);
  }),

  http.put(CalendarAPI.event(), async ({ params, request }) => {
    await delay();

    const eventId = z.string().parse(params.id);
    const input = updateEventInputSchema.parse(request);
    const updatedEvent = eventStore.update({ ...input, id: eventId });

    if (!updatedEvent) {
      throw new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(updatedEvent);
  }),

  http.delete(CalendarAPI.event(), async ({ params }) => {
    await delay();

    const id = z.string().parse(params.id);
    taskStore.remove(id);

    return HttpResponse.json({});
  }),
];
