import { useCallback, useMemo, useState } from "react";
import { useUpdateEvent } from "../queries/use-update-event";
import { DateEvent, DraggingDateEvent } from "../type";
import { addMinutes, differenceInMinutes, isSameMinute } from "date-fns";

export type MoveEventActions = {
  startMove: (event: DateEvent, moveStartDate: Date) => void;
  updateMoveDest: (moveDestDate: Date) => void;
  move: () => void;
};

export const useMoveEventOnWeeklyCalendar = () => {
  const updateEventMutation = useUpdateEvent();

  const [movingEvent, setMovingEvent] = useState<DraggingDateEvent>();

  const startMove: MoveEventActions["startMove"] = useCallback(
    (event, moveStartDate) => {
      setMovingEvent({
        ...event,
        prevMouseOverDate: moveStartDate,
      });
    },
    [],
  );

  const updateMoveDest: MoveEventActions["updateMoveDest"] = useCallback(
    (moveEndDate: Date) => {
      if (
        !movingEvent ||
        isSameMinute(moveEndDate, movingEvent.prevMouseOverDate)
      ) {
        return;
      }

      const diffMinutes = differenceInMinutes(
        moveEndDate,
        movingEvent.prevMouseOverDate,
      );

      setMovingEvent({
        ...movingEvent,
        start: addMinutes(movingEvent.start, diffMinutes),
        end: addMinutes(movingEvent.end, diffMinutes),
        prevMouseOverDate: moveEndDate,
      });
    },
    [movingEvent],
  );

  const move: MoveEventActions["move"] = useCallback(() => {
    if (!movingEvent) {
      return;
    }

    updateEventMutation.mutate(movingEvent);
    setMovingEvent(undefined);
  }, [movingEvent, updateEventMutation]);

  const moveEventActions = useMemo((): MoveEventActions => {
    return { startMove, updateMoveDest, move };
  }, [updateMoveDest, startMove, move]);

  return { movingEvent, moveEventActions };
};
