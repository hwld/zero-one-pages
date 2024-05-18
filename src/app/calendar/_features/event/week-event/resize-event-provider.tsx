import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ResizeWeekEventPreview, WeekEvent } from "./type";
import { useUpdateEvent } from "../use-update-event";
import { endOfDay, isAfter, isBefore, startOfDay, subDays } from "date-fns";

type ResizeWeekEventActions = {
  startResize: (params: {
    event: WeekEvent;
    origin: ResizeWeekEventPreview["origin"];
  }) => void;
  updateResizeDest: (day: Date) => void;
  resize: () => void;
};

type ResizeWeekEventContext = {
  isEventResizing: boolean;
  resizeEventPreview: ResizeWeekEventPreview | undefined;
  resizeEventActions: ResizeWeekEventActions;
};

const Context = createContext<ResizeWeekEventContext | undefined>(undefined);

export const useResizeWeekEvent = (): ResizeWeekEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("ResizeWeekEventProviderが存在しません");
  }
  return ctx;
};

export const ResizeWeekEventProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const updateEventMutation = useUpdateEvent();

  const [state, setState] = useState<{
    isEventResizing: boolean;
    resizeEventPreview: ResizeWeekEventPreview | undefined;
  }>({ isEventResizing: false, resizeEventPreview: undefined });

  const { isEventResizing, resizeEventPreview } = state;

  const startResize: ResizeWeekEventActions["startResize"] = useCallback(
    ({ event, origin }) => {
      setState({
        isEventResizing: true,
        resizeEventPreview: { ...event, origin, updatedAt: Date.now() },
      });
    },
    [],
  );

  const updateResizeDest: ResizeWeekEventActions["updateResizeDest"] =
    useCallback(
      (day) => {
        if (!resizeEventPreview) {
          return;
        }

        switch (resizeEventPreview.origin) {
          case "eventStart": {
            if (isBefore(day, resizeEventPreview.start)) {
              setState((prev) => ({
                ...prev,
                resizeEventPreview: {
                  ...resizeEventPreview,
                  origin: "eventEnd",
                  start: day,
                  end: endOfDay(subDays(resizeEventPreview.start, 1)),
                  updatedAt: Date.now(),
                },
              }));
            } else {
              setState((prev) => ({
                ...prev,
                resizeEventPreview: {
                  ...resizeEventPreview,
                  end: endOfDay(day),
                  updatedAt: Date.now(),
                },
              }));
            }
            return;
          }
          case "eventEnd": {
            if (isAfter(day, resizeEventPreview.end)) {
              setState((prev) => ({
                ...prev,
                resizeEventPreview: {
                  ...resizeEventPreview,
                  origin: "eventStart",
                  start: startOfDay(resizeEventPreview.end),
                  end: endOfDay(day),
                  updatedAt: Date.now(),
                },
              }));
            } else {
              setState((prev) => ({
                ...prev,
                resizeEventPreview: {
                  ...resizeEventPreview,
                  start: day,
                  updatedAt: Date.now(),
                },
              }));
            }

            return;
          }
          default: {
            throw new Error(resizeEventPreview.origin satisfies never);
          }
        }
      },
      [resizeEventPreview],
    );

  const resize: ResizeWeekEventActions["resize"] = useCallback(() => {
    if (!resizeEventPreview) {
      return;
    }

    updateEventMutation.mutate(resizeEventPreview, {
      onSettled: () => {
        setState((prev) => {
          if (prev.isEventResizing) {
            return prev;
          }

          return { ...prev, resizeEventPreview: undefined };
        });
      },
    });

    setState((prev) => ({ ...prev, isEventResizing: false }));
  }, [resizeEventPreview, updateEventMutation]);

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

  const value: ResizeWeekEventContext = useMemo(
    () => ({
      isEventResizing,
      resizeEventPreview,
      resizeEventActions: { startResize, updateResizeDest, resize },
    }),
    [
      isEventResizing,
      resize,
      resizeEventPreview,
      startResize,
      updateResizeDest,
    ],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
