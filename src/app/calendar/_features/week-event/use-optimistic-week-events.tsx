import { Event } from "@/app/calendar/_mocks/event-store";
import { useMoveWeekEvent } from "./move-event-provider";
import { getEventFromMoveEventPreview, getWeekEvents } from "./utils";
import { useResizeWeekEvent } from "./resize-event-provider";

/**
 *  週を指定して、DateEventのMoveやResizeの状態から更新後のweek-eventsを返す
 */
export const useOptimisticWeekEvents = ({
  week,
  events,
}: {
  week: Date[];
  events: Event[];
}) => {
  const { isEventMoving, moveEventPreview } = useMoveWeekEvent();
  const { resizeEventPreview } = useResizeWeekEvent();

  return getWeekEvents({
    week,
    events: events.map((event): Event => {
      if (!isEventMoving && moveEventPreview?.id === event.id) {
        return getEventFromMoveEventPreview(moveEventPreview);
      }

      if (resizeEventPreview?.id === event.id) {
        return resizeEventPreview;
      }

      return event;
    }),
  });
};
