import {
  PropsWithChildren,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUpdateEvent } from "../use-update-event";
import { MoveDateEventPreview } from "./type";
import { DateEvent } from "./type";
import { addMinutes, differenceInMinutes, isSameMinute } from "date-fns";
import { MouseHistory } from "../../../utils";
import { getDateFromY } from "./utils";

type MoveDateEventActions = {
  startMove: (event: DateEvent, moveStart: { date: Date; y: number }) => void;
  updateMoveDest: (day: Date, y: number) => void;
  scroll: (scrollTop: number) => void;
  move: () => void;
};

type MoveDateEventContext = {
  isEventMoving: boolean;
  moveEventPreview: MoveDateEventPreview | undefined;
  moveEventActions: MoveDateEventActions;
};

const Context = createContext<MoveDateEventContext | undefined>(undefined);

export const useMoveDateEvent = (): MoveDateEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("MoveDateEventProviderが存在しません");
  }
  return ctx;
};

export const MoveDateEventProvider: React.FC<
  { scrollableRef: RefObject<HTMLElement> } & PropsWithChildren
> = ({ scrollableRef, children }) => {
  const updateEventMutation = useUpdateEvent();

  const [state, setState] = useState<{
    isEventMoving: boolean;
    moveEventPreview: MoveDateEventPreview | undefined;
  }>({ isEventMoving: false, moveEventPreview: undefined });

  const { isEventMoving, moveEventPreview } = state;

  const mouseHistoryRef = useRef<MouseHistory>();

  const startMove: MoveDateEventActions["startMove"] = useCallback(
    (event, { date, y }) => {
      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      const moveStartDate = getDateFromY(date, y);

      setState({
        isEventMoving: true,
        moveEventPreview: {
          ...event,
          prevMouseOverDate: moveStartDate,
          updatedAt: Date.now(),
        },
      });
    },
    [scrollableRef],
  );

  const updateMoveDest: MoveDateEventActions["updateMoveDest"] = useCallback(
    (day: Date, y: number) => {
      const moveDest = getDateFromY(day, y);
      if (
        !isEventMoving ||
        !moveEventPreview ||
        isSameMinute(moveDest, moveEventPreview.prevMouseOverDate)
      ) {
        return;
      }

      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      const diffMinutes = differenceInMinutes(
        moveDest,
        moveEventPreview.prevMouseOverDate,
      );

      setState((prev) => ({
        ...prev,
        moveEventPreview: {
          ...moveEventPreview,
          start: addMinutes(moveEventPreview.start, diffMinutes),
          end: addMinutes(moveEventPreview.end, diffMinutes),
          prevMouseOverDate: moveDest,
          updatedAt: Date.now(),
        },
      }));
    },
    [isEventMoving, moveEventPreview, scrollableRef],
  );

  const scroll: MoveDateEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!isEventMoving || !moveEventPreview || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateMoveDest(moveEventPreview.prevMouseOverDate, y);
    },
    [isEventMoving, moveEventPreview, updateMoveDest],
  );

  const move: MoveDateEventActions["move"] = useCallback(() => {
    if (!moveEventPreview) {
      return;
    }

    updateEventMutation.mutate(moveEventPreview, {
      onSettled: () => {
        setState((prev) => {
          if (prev.isEventMoving) {
            return prev;
          }
          return { ...prev, moveEventPreview: undefined };
        });
      },
    });

    setState((prev) => ({ ...prev, isEventMoving: false }));
  }, [moveEventPreview, updateEventMutation]);

  useEffect(() => {
    const moveEvent = (e: MouseEvent) => {
      if (e.button === 0) {
        move();
      }
    };

    document.addEventListener("mouseup", moveEvent);
    return () => {
      document.removeEventListener("mouseup", moveEvent);
    };
  }, [move]);

  const value: MoveDateEventContext = useMemo(() => {
    return {
      isEventMoving,
      moveEventPreview,
      moveEventActions: { startMove, updateMoveDest, scroll, move },
    };
  }, [
    isEventMoving,
    move,
    moveEventPreview,
    scroll,
    startMove,
    updateMoveDest,
  ]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
