import { useCallback, useEffect, useMemo, useState } from "react";
import { DateEvent, ResizingDateEvent } from "../type";
import { useUpdateEvent } from "../queries/use-update-event";
import { isAfter, isBefore, isSameMinute } from "date-fns";

export type ResizeEventActions = {
  startResize: (params: {
    event: DateEvent;
    origin: ResizingDateEvent["origin"];
  }) => void;
  updateResizeDest: (resizeDestDate: Date) => void;
  resize: () => void;
};

export const useResizeEventEffect = () => {
  const updateEventMutation = useUpdateEvent();
  const [resizingEvent, setResizingEvent] = useState<ResizingDateEvent>();

  const startResize: ResizeEventActions["startResize"] = useCallback(
    ({ event, origin }) => {
      setResizingEvent({ ...event, origin });
    },
    [],
  );

  const updateResizeDest: ResizeEventActions["updateResizeDest"] = useCallback(
    (resizeDest) => {
      if (!resizingEvent) {
        return;
      }

      switch (resizingEvent.origin) {
        case "eventStart": {
          if (isSameMinute(resizingEvent.start, resizeDest)) {
            return;
          }

          if (isBefore(resizeDest, resizingEvent.start)) {
            setResizingEvent({
              ...resizingEvent,
              origin: "eventEnd",
              start: resizeDest,
              end: resizingEvent.start,
            });
          } else {
            setResizingEvent({
              ...resizingEvent,
              end: resizeDest,
            });
          }
          return;
        }
        case "eventEnd": {
          if (isSameMinute(resizingEvent.end, resizeDest)) {
            return;
          }

          if (isAfter(resizeDest, resizingEvent.end)) {
            setResizingEvent({
              ...resizingEvent,
              origin: "eventStart",
              start: resizingEvent.end,
              end: resizeDest,
            });
          } else {
            setResizingEvent({
              ...resizingEvent,
              start: resizeDest,
            });
          }
          return;
        }
        default: {
          throw new Error(resizingEvent.origin satisfies never);
        }
      }
    },
    [resizingEvent],
  );

  const resize: ResizeEventActions["resize"] = useCallback(() => {
    if (!resizingEvent) {
      return;
    }

    updateEventMutation.mutate(resizingEvent);
    setResizingEvent(undefined);
  }, [resizingEvent, updateEventMutation]);

  const resizeEventActions: ResizeEventActions = useMemo(() => {
    return { startResize, updateResizeDest, resize };
  }, [resize, startResize, updateResizeDest]);

  useEffect(() => {
    const endResizeEvent = (e: MouseEvent) => {
      if (e.button === 0) {
        resize();
      }
    };

    document.addEventListener("mouseup", endResizeEvent);
    return () => {
      document.removeEventListener("mouseup", endResizeEvent);
    };
  }, [resize]);

  return { resizingEvent, resizeEventActions };
};
