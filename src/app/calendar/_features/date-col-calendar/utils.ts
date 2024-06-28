import { differenceInHours } from "date-fns";
import { Event } from "../../_backend/event-store";

type SplitEventResult = {
  /**
   * 終日イベントと期間が24時間を超えるイベント
   */
  longTermEvents: Event[];
  defaultEvents: Event[];
};

export const splitEvent = (events: Event[]): SplitEventResult => {
  const longTermEvents: Event[] = [];
  const defaultEvents: Event[] = [];

  events.forEach((event) => {
    if (event.allDay || differenceInHours(event.end, event.start) > 24) {
      longTermEvents.push(event);
      return;
    }

    defaultEvents.push(event);
    return;
  });

  return { longTermEvents, defaultEvents };
};
