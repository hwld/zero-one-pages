import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DateEvent, ResizeEventPreview } from "../../type";
import { useUpdateEvent } from "../../_queries/use-update-event";
import { isAfter, isBefore, isSameMinute } from "date-fns";
import { MouseHistory, getDateFromY } from "./utils";

export type ResizeEventActions = {
  startResize: (params: {
    event: DateEvent;
    origin: ResizeEventPreview["origin"];
    y: number;
  }) => void;
  scroll: (scrollTop: number) => void;
  updateResizeDest: (day: Date, y: number) => void;
  resize: () => void;
};

type Params = { scrollableRef: RefObject<HTMLElement> };

export const useResizeEventEffect = ({ scrollableRef }: Params) => {
  const updateEventMutation = useUpdateEvent();

  const [resizeEventPreview, setResizeEventPreview] =
    useState<ResizeEventPreview>();
  const [isEventResizing, setIsEventResizing] = useState(false);

  const mouseHistoryRef = useRef<MouseHistory>();

  const startResize: ResizeEventActions["startResize"] = useCallback(
    ({ event, origin, y }) => {
      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      setIsEventResizing(true);
      setResizeEventPreview({ ...event, origin });
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

      if (!isEventResizing || !resizeEventPreview) {
        return;
      }

      switch (resizeEventPreview.origin) {
        case "eventStart": {
          if (isSameMinute(resizeEventPreview.start, resizeDest)) {
            return;
          }

          if (isBefore(resizeDest, resizeEventPreview.start)) {
            setResizeEventPreview({
              ...resizeEventPreview,
              origin: "eventEnd",
              start: resizeDest,
              end: resizeEventPreview.start,
            });
          } else {
            setResizeEventPreview({
              ...resizeEventPreview,
              end: resizeDest,
            });
          }
          return;
        }
        case "eventEnd": {
          if (isSameMinute(resizeEventPreview.end, resizeDest)) {
            return;
          }

          if (isAfter(resizeDest, resizeEventPreview.end)) {
            setResizeEventPreview({
              ...resizeEventPreview,
              origin: "eventStart",
              start: resizeEventPreview.end,
              end: resizeDest,
            });
          } else {
            setResizeEventPreview({
              ...resizeEventPreview,
              start: resizeDest,
            });
          }
          return;
        }
        default: {
          throw new Error(resizeEventPreview.origin satisfies never);
        }
      }
    },
    [isEventResizing, resizeEventPreview, scrollableRef],
  );

  const scroll: ResizeEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!isEventResizing || !resizeEventPreview || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateResizeDest(
        resizeEventPreview.origin === "eventEnd"
          ? resizeEventPreview.start
          : resizeEventPreview.end,
        y,
      );
    },
    [isEventResizing, resizeEventPreview, updateResizeDest],
  );

  const resize: ResizeEventActions["resize"] = useCallback(() => {
    if (!resizeEventPreview) {
      return;
    }

    updateEventMutation.mutate(resizeEventPreview, {
      onSettled: () => {
        setResizeEventPreview(undefined);
      },
    });
    setIsEventResizing(false);
  }, [resizeEventPreview, updateEventMutation]);

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

  return {
    isEventResizing,
    resizeEventPreview,
    resizeEventActions,
  };
};
