import {
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { DragDateRange } from "../utils";
import { CreateEventInput } from "../mocks/api";
import { max, min } from "date-fns";

export type PrepareCreateEventState = {
  dragDateRange: DragDateRange | undefined;
  defaultCreateEventValues: Omit<CreateEventInput, "title"> | undefined;
};

export type PrepareCreateEventActions = {
  setDragDateRange: Dispatch<
    SetStateAction<PrepareCreateEventState["dragDateRange"]>
  >;
  startDrag: (dragStart: Date) => void;
  updateDragEnd: (dragEnd: Date) => void;
  setDefaultValues: () => void;
  clearState: () => void;
};

export const usePrepareCreateEventEffect = () => {
  const [dragDateRange, setDragDateRange] =
    useState<PrepareCreateEventState["dragDateRange"]>();

  const startDrag: PrepareCreateEventActions["startDrag"] = useCallback(
    (dragStart) => {
      setDragDateRange({ dragStartDate: dragStart, dragEndDate: dragStart });
    },
    [],
  );

  const updateDragEnd: PrepareCreateEventActions["updateDragEnd"] = useCallback(
    (dragEnd) => {
      if (!dragDateRange) {
        return;
      }
      setDragDateRange({ ...dragDateRange, dragEndDate: dragEnd });
    },
    [dragDateRange],
  );

  const [defaultCreateEventValues, setDefaultCreateEventValues] =
    useState<PrepareCreateEventState["defaultCreateEventValues"]>();

  const setDefaultValues: PrepareCreateEventActions["setDefaultValues"] =
    useCallback(() => {
      if (!dragDateRange) {
        return;
      }

      const { dragStartDate, dragEndDate } = dragDateRange;

      const eventStart = min([dragStartDate, dragEndDate]);
      const eventEnd = max([dragStartDate, dragEndDate]);

      setDefaultCreateEventValues({
        allDay: true,
        start: eventStart,
        end: eventEnd,
      });
    }, [dragDateRange]);

  const clearState: PrepareCreateEventActions["clearState"] =
    useCallback(() => {
      setDragDateRange(undefined);
      setDefaultCreateEventValues(undefined);
    }, []);

  const prepareCreateEventState: PrepareCreateEventState = useMemo(() => {
    return { dragDateRange, defaultCreateEventValues };
  }, [defaultCreateEventValues, dragDateRange]);

  const prepareCreateEventActions: PrepareCreateEventActions = useMemo(() => {
    return {
      setDragDateRange,
      startDrag,
      updateDragEnd,
      setDefaultValues,
      clearState,
    };
  }, [clearState, setDefaultValues, startDrag, updateDragEnd]);

  useEffect(() => {
    const openCreateEventDialog = (event: MouseEvent) => {
      if (event.button === 0) {
        setDefaultValues();
      }
    };

    document.addEventListener("mouseup", openCreateEventDialog);
    return () => {
      document.removeEventListener("mouseup", openCreateEventDialog);
    };
  }, [setDefaultValues]);

  return { prepareCreateEventState, prepareCreateEventActions };
};
