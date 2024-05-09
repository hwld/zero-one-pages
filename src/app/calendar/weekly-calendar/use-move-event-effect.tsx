import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUpdateEvent } from "../queries/use-update-event";
import { DateEvent, DraggingDateEvent } from "../type";
import { addMinutes, differenceInMinutes, isSameMinute } from "date-fns";
import { MouseHistory, getDateFromY } from "./utils";

export type MoveEventActions = {
  startMove: (event: DateEvent, moveStart: { date: Date; y: number }) => void;
  updateMoveDest: (day: Date, y: number) => void;
  scroll: (scrollTop: number) => void;
  move: () => void;
};

type Params = { scrollableRef: RefObject<HTMLElement> };

export const useMoveEventEffect = ({ scrollableRef }: Params) => {
  const updateEventMutation = useUpdateEvent();

  const [movingEvent, setMovingEvent] = useState<DraggingDateEvent>();

  const mouseHistoryRef = useRef<MouseHistory>();

  const startMove: MoveEventActions["startMove"] = useCallback(
    (event, { date, y }) => {
      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      const moveStartDate = getDateFromY(date, y);

      setMovingEvent({
        ...event,
        prevMouseOverDate: moveStartDate,
      });
    },
    [scrollableRef],
  );

  const updateMoveDest: MoveEventActions["updateMoveDest"] = useCallback(
    (day: Date, y: number) => {
      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      const moveDest = getDateFromY(day, y);

      if (
        !movingEvent ||
        isSameMinute(moveDest, movingEvent.prevMouseOverDate)
      ) {
        return;
      }

      const diffMinutes = differenceInMinutes(
        moveDest,
        movingEvent.prevMouseOverDate,
      );

      setMovingEvent({
        ...movingEvent,
        start: addMinutes(movingEvent.start, diffMinutes),
        end: addMinutes(movingEvent.end, diffMinutes),
        prevMouseOverDate: moveDest,
      });
    },
    [movingEvent, scrollableRef],
  );

  const scroll: MoveEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!movingEvent || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateMoveDest(movingEvent.end, y);
    },
    [movingEvent, updateMoveDest],
  );

  const move: MoveEventActions["move"] = useCallback(() => {
    if (!movingEvent) {
      return;
    }

    updateEventMutation.mutate(movingEvent);
    setMovingEvent(undefined);
  }, [movingEvent, updateEventMutation]);

  const moveEventActions = useMemo((): MoveEventActions => {
    return { startMove, updateMoveDest, scroll, move };
  }, [startMove, updateMoveDest, scroll, move]);

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

  return { movingEvent, moveEventActions };
};
