import { z } from "zod";
import { CreateEventInput, UpdateEventInput } from "./api";
import { addHours } from "date-fns";

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  allDay: z.boolean(),
  start: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  end: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
});
export type Event = z.infer<typeof eventSchema>;

class EventStore {
  private events: Event[] = [
    {
      id: crypto.randomUUID(),
      title: "Event",
      allDay: false,
      start: new Date(),
      end: addHours(new Date(), 3),
    },
  ];

  public getAll(): Event[] {
    return this.events;
  }

  public get(id: string): Event | undefined {
    return this.events.find((e) => e.id === id);
  }

  public add(input: CreateEventInput): Event {
    const addedEvent: Event = {
      id: crypto.randomUUID(),
      title: input.title,
      allDay: input.allDay,
      start: input.start,
      end: input.end,
    };
    this.events = [...this.events, addedEvent];

    return addedEvent;
  }

  public update(input: UpdateEventInput & { id: string }): Event | undefined {
    this.events = this.events.map((event) => {
      if (event.id === input.id) {
        return {
          ...event,
          title: input.title,
          allDay: input.allDay,
          start: input.start,
          end: input.end,
        };
      }
      return event;
    });

    const updatedEvent = this.events.find((e) => e.id === input.id);
    return updatedEvent;
  }

  public remove(id: string) {
    this.events = this.events.filter((e) => e.id !== id);
  }
}

export const eventStore = new EventStore();
