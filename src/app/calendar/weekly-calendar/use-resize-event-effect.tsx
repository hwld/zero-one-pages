import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DateEvent, ResizingDateEvent } from "../type";
import { useUpdateEvent } from "../queries/use-update-event";
import { isAfter, isBefore, isSameMinute } from "date-fns";
import { MouseHistory, getDateFromY } from "./utils";

export type ResizeEventActions = {
  startResize: (params: {
    event: DateEvent;
    origin: ResizingDateEvent["origin"];
    y: number;
  }) => void;
  scroll: (scrollTop: number) => void;
  updateResizeDest: (day: Date, y: number) => void;
  resize: () => void;
};

type Params = { scrollableRef: RefObject<HTMLElement> };

export const useResizeEventEffect = ({ scrollableRef }: Params) => {
  const updateEventMutation = useUpdateEvent();
  const [resizingEvent, setResizingEvent] = useState<ResizingDateEvent>();

  const mouseHistoryRef = useRef<MouseHistory>();

  const startResize: ResizeEventActions["startResize"] = useCallback(
    ({ event, origin, y }) => {
      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      setResizingEvent({ ...event, origin });
    },
    [scrollableRef],
  );

  const updateResizeDest: ResizeEventActions["updateResizeDest"] = useCallback(
    (day, y) => {
      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      const resizeDest = getDateFromY(day, y);

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
    [resizingEvent, scrollableRef],
  );

  const scroll: ResizeEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!resizingEvent || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateResizeDest(
        resizingEvent.origin === "eventEnd"
          ? resizingEvent.start
          : resizingEvent.end,
        y,
      );
    },
    [resizingEvent, updateResizeDest],
  );

  const resize: ResizeEventActions["resize"] = useCallback(() => {
    if (!resizingEvent) {
      return;
    }

    updateEventMutation.mutate(resizingEvent);
    setResizingEvent(undefined);
  }, [resizingEvent, updateEventMutation]);

  const resizeEventActions: ResizeEventActions = useMemo(() => {
    return { startResize, updateResizeDest, scroll, resize };
  }, [resize, scroll, startResize, updateResizeDest]);

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
