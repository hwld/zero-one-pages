import { useCallback, useMemo, useState } from "react";
import { DraggingEvent, getEventFromDraggingEvent } from "../utils";
import { useUpdateEvent } from "../queries/use-update-event";
import { Event } from "../mocks/event-store";

export type MoveEventActions = {
  startMove: (event: Event, moveStartDate: Date) => void;
  updateMoveEnd: (moveEndDate: Date) => void;
  move: () => void;
};

export const useMoveEvent = () => {
  const updateEventMutation = useUpdateEvent();
  const [movingEvent, setMovingEvent] = useState<DraggingEvent>();

  const startMove: MoveEventActions["startMove"] = useCallback(
    (event, moveStartDate) => {
      setMovingEvent({
        event,
        dragStartDate: moveStartDate,
        dragEndDate: moveStartDate,
      });
    },
    [],
  );

  const updateMoveEnd: MoveEventActions["updateMoveEnd"] = useCallback(
    (moveEndDate: Date) => {
      if (!movingEvent) {
        return;
      }

      setMovingEvent({ ...movingEvent, dragEndDate: moveEndDate });
    },
    [movingEvent],
  );

  const move: MoveEventActions["move"] = useCallback(() => {
    if (!movingEvent) {
      return;
    }

    const updatedEvent = getEventFromDraggingEvent(movingEvent);
    updateEventMutation.mutate(updatedEvent);

    setMovingEvent(undefined);
  }, [movingEvent, updateEventMutation]);

  const moveEventActions = useMemo((): MoveEventActions => {
    return { startMove, updateMoveEnd, move };
  }, [updateMoveEnd, startMove, move]);

  return { movingEvent, moveEventActions };
};
