import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getEventFromMoveEventPreview } from "./utils";
import { MoveWeekEventPreview } from "./type";
import { useUpdateEvent } from "../../../_queries/use-update-event";
import { WeekEvent } from "./type";

export type MoveWeekEventActions = {
  startMove: (event: WeekEvent, moveStartDate: Date) => void;
  updateMoveEnd: (moveEndDate: Date) => void;
  move: () => void;
};

type MoveWeekEventContext = {
  isEventMoving: boolean;
  moveEventPreview: MoveWeekEventPreview | undefined;
  moveEventActions: MoveWeekEventActions;
};

const Context = createContext<MoveWeekEventContext | undefined>(undefined);

export const useMoveWeekEvent = (): MoveWeekEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("PrepareCreateEventProviderが存在しません");
  }
  return ctx;
};

export const MoveWekEventProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const updateEventMutation = useUpdateEvent();

  const [state, setState] = useState<{
    isEventMoving: boolean;
    moveEventPreview: MoveWeekEventPreview | undefined;
  }>({ isEventMoving: false, moveEventPreview: undefined });

  const { moveEventPreview, isEventMoving } = state;

  const startMove: MoveWeekEventActions["startMove"] = useCallback(
    (event, moveStartDate) => {
      setState({
        isEventMoving: true,
        moveEventPreview: {
          event,
          dragStartDate: moveStartDate,
          dragEndDate: moveStartDate,
        },
      });
    },
    [],
  );

  const updateMoveEnd: MoveWeekEventActions["updateMoveEnd"] = useCallback(
    (moveEndDate: Date) => {
      if (!isEventMoving || !moveEventPreview) {
        return;
      }

      setState((prev) => ({
        ...prev,
        moveEventPreview: { ...moveEventPreview, dragEndDate: moveEndDate },
      }));
    },
    [isEventMoving, moveEventPreview],
  );

  const move: MoveWeekEventActions["move"] = useCallback(() => {
    if (!moveEventPreview) {
      return;
    }

    const updatedEvent = getEventFromMoveEventPreview(moveEventPreview);
    updateEventMutation.mutate(updatedEvent, {
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

  const value: MoveWeekEventContext = useMemo(
    () => ({
      isEventMoving,
      moveEventPreview,
      moveEventActions: { startMove, updateMoveEnd, move },
    }),
    [isEventMoving, move, moveEventPreview, startMove, updateMoveEnd],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
