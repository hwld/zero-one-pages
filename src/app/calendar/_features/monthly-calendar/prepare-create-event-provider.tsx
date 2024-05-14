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
import { DragDateRange } from "../utils";
import { CreateEventInput } from "../../_mocks/api";
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

type PrepareCreateEventContext = {
  prepareCreateEventState: PrepareCreateEventState;
  prepareCreateEventActions: PrepareCreateEventActions;
};

const Context = createContext<PrepareCreateEventContext | undefined>(undefined);

export const usePrepareCreateEvent = (): PrepareCreateEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("PrepareCreateEventProviderが存在しません");
  }
  return ctx;
};

// TODO:　各操作のProviderがweekly-calendarとmonthly-calendar毎に存在しているが、weekly-calendarのlong-term-event-rowではmonthly-calendarのProviderを使用したいので、カレンダー単位ではなくイベントの型で分けたい
// DateEventとWeekEventで分けられる？
export const PrepareCreateEventProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
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

  const value: PrepareCreateEventContext = useMemo(
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
