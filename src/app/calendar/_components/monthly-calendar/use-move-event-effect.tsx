import { useCallback, useEffect, useMemo, useState } from "react";
import { DraggingEvent, getEventFromDraggingEvent } from "../utils";
import { useUpdateEvent } from "../../_queries/use-update-event";
import { Event } from "../../_mocks/event-store";

export type MoveEventActions = {
  startMove: (event: Event, moveStartDate: Date) => void;
  updateMoveEnd: (moveEndDate: Date) => void;
  move: () => void;
};

export const useMoveEventEffect = () => {
  const updateEventMutation = useUpdateEvent();
  const [movingEvent, setMovingEvent] = useState<DraggingEvent>();
  const [isEventMoving, setIsEventMoving] = useState(false);

  const startMove: MoveEventActions["startMove"] = useCallback(
    (event, moveStartDate) => {
      setIsEventMoving(true);
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
      if (!isEventMoving || !movingEvent) {
        return;
      }

      setMovingEvent({ ...movingEvent, dragEndDate: moveEndDate });
    },
    [isEventMoving, movingEvent],
  );

  const move: MoveEventActions["move"] = useCallback(() => {
    if (!movingEvent) {
      return;
    }

    const updatedEvent = getEventFromDraggingEvent(movingEvent);
    updateEventMutation.mutate(updatedEvent, {
      onSettled: () => {
        setMovingEvent(undefined);
      },
    });
    setIsEventMoving(false);
  }, [movingEvent, updateEventMutation]);

  const moveEventActions = useMemo((): MoveEventActions => {
    return { startMove, updateMoveEnd, move };
  }, [updateMoveEnd, startMove, move]);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        move();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [move]);

  return { isEventMoving, movingEvent, moveEventActions };
};
