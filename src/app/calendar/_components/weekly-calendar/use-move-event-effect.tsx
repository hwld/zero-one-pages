import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUpdateEvent } from "../../_queries/use-update-event";
import { DateEvent, MoveEventPreview } from "../../type";
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

  const [moveEventPreview, setMoveEventPreview] = useState<MoveEventPreview>();
  const [isEventMoving, setIsEventMoving] = useState(false);

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

      setIsEventMoving(true);
      setMoveEventPreview({
        ...event,
        prevMouseOverDate: moveStartDate,
        sourceDateEvent: event,
      });
    },
    [scrollableRef],
  );

  const updateMoveDest: MoveEventActions["updateMoveDest"] = useCallback(
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

      setMoveEventPreview({
        ...moveEventPreview,
        start: addMinutes(moveEventPreview.start, diffMinutes),
        end: addMinutes(moveEventPreview.end, diffMinutes),
        prevMouseOverDate: moveDest,
      });
    },
    [isEventMoving, moveEventPreview, scrollableRef],
  );

  const scroll: MoveEventActions["scroll"] = useCallback(
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

  const move: MoveEventActions["move"] = useCallback(() => {
    if (!moveEventPreview) {
      return;
    }

    updateEventMutation.mutate(moveEventPreview, {
      onSettled: () => {
        setMoveEventPreview(undefined);
      },
    });
    setIsEventMoving(false);
  }, [moveEventPreview, updateEventMutation]);

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

  return {
    isEventMoving,
    moveEventPreview,
    moveEventActions,
  };
};
