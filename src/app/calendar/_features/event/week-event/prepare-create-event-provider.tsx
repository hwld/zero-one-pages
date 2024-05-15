import {
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";
import { DragDateRange } from "../../../utils";
import { CreateEventInput } from "../../../_mocks/api";
import { max, min } from "date-fns";

export type PrepareCreateWeekEventState = {
  dragDateRange: DragDateRange | undefined;
  defaultCreateEventValues: Omit<CreateEventInput, "title"> | undefined;
};

export type PrepareCreateWeekEventActions = {
  setDragDateRange: Dispatch<
    SetStateAction<PrepareCreateWeekEventState["dragDateRange"]>
  >;
  startDrag: (dragStart: Date) => void;
  updateDragEnd: (dragEnd: Date) => void;
  setDefaultValues: () => void;
  clearState: () => void;
};

type PrepareCreateWeekEventContext = {
  prepareCreateEventState: PrepareCreateWeekEventState;
  prepareCreateEventActions: PrepareCreateWeekEventActions;
};

const Context = createContext<PrepareCreateWeekEventContext | undefined>(
  undefined,
);

export const usePrepareCreateWeekEvent = (): PrepareCreateWeekEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("PrepareCreateWeekEventProviderが存在しません");
  }
  return ctx;
};

export const PrepareCreateWeekEventProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [dragDateRange, setDragDateRange] =
    useState<PrepareCreateWeekEventState["dragDateRange"]>();

  const startDrag: PrepareCreateWeekEventActions["startDrag"] = useCallback(
    (dragStart) => {
      setDragDateRange({ dragStartDate: dragStart, dragEndDate: dragStart });
    },
    [],
  );

  const updateDragEnd: PrepareCreateWeekEventActions["updateDragEnd"] =
    useCallback(
      (dragEnd) => {
        if (!dragDateRange) {
          return;
        }
        setDragDateRange({ ...dragDateRange, dragEndDate: dragEnd });
      },
      [dragDateRange],
    );

  const [defaultCreateEventValues, setDefaultCreateEventValues] =
    useState<PrepareCreateWeekEventState["defaultCreateEventValues"]>();

  const setDefaultValues: PrepareCreateWeekEventActions["setDefaultValues"] =
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

  const clearState: PrepareCreateWeekEventActions["clearState"] =
    useCallback(() => {
      setDragDateRange(undefined);
      setDefaultCreateEventValues(undefined);
    }, []);

  const prepareCreateEventState: PrepareCreateWeekEventState = useMemo(() => {
    return { dragDateRange, defaultCreateEventValues };
  }, [defaultCreateEventValues, dragDateRange]);

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

  const value: PrepareCreateWeekEventContext = useMemo(
    () => ({
      prepareCreateEventState,
      prepareCreateEventActions: {
        setDragDateRange,
        startDrag,
        updateDragEnd,
        setDefaultValues,
        clearState,
      },
    }),
    [
      clearState,
      prepareCreateEventState,
      setDefaultValues,
      startDrag,
      updateDragEnd,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
