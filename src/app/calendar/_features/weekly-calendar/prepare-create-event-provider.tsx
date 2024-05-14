import {
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  RefObject,
  useRef,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import { DragDateRange } from "../utils";
import { CreateEventInput } from "../../_mocks/api";
import { addMinutes, max, min, startOfDay } from "date-fns";
import { EVENT_MIN_MINUTES, MouseHistory, getDateFromY } from "./utils";

export type PrepareCreateEventState = {
  dragDateRange: DragDateRange | undefined;
  defaultCreateEventValues: Omit<CreateEventInput, "title"> | undefined;
};

export type PrepareCreateEventActions = {
  setDragDateRange: Dispatch<
    SetStateAction<PrepareCreateEventState["dragDateRange"]>
  >;
  startDrag: (day: Date, y: number) => void;
  updateDragEnd: (day: Date, y: number) => void;
  scroll: (scrollTop: number) => void;
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

export const PrepareCreateEventProvider: React.FC<
  { scrollableRef: RefObject<HTMLElement> } & PropsWithChildren
> = ({ scrollableRef, children }) => {
  const [dragDateRange, setDragDateRange] =
    useState<PrepareCreateEventState["dragDateRange"]>();

  // マウスイベントが発生したときのyとscrollableのscrollTopを保存して、スクロールされたときに
  // これを使用してdragDateRangeを更新する
  const mouseHistoryRef = useRef<MouseHistory>();

  const startDrag: PrepareCreateEventActions["startDrag"] = useCallback(
    (day, y) => {
      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      const targetDate = startOfDay(day);

      // ドラッグ開始の時点では常にクリックした最小領域が期間として設定されるようにする
      const dragStartDate = getDateFromY(targetDate, y, "floor");
      const dragEndDate = addMinutes(dragStartDate, EVENT_MIN_MINUTES);

      setDragDateRange({ dragStartDate, dragEndDate });
    },
    [scrollableRef],
  );

  const updateDragEnd: PrepareCreateEventActions["updateDragEnd"] = useCallback(
    (day, y) => {
      if (!dragDateRange) {
        return;
      }

      if (scrollableRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableRef.current.scrollTop,
        };
      }

      const targetDate = startOfDay(day);
      const dragEndDate = getDateFromY(targetDate, y);
      setDragDateRange({ ...dragDateRange, dragEndDate });
    },
    [dragDateRange, scrollableRef],
  );

  const scroll: PrepareCreateEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!dragDateRange || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateDragEnd(dragDateRange.dragEndDate, y);
    },
    [dragDateRange, updateDragEnd],
  );

  const clearState: PrepareCreateEventActions["clearState"] =
    useCallback(() => {
      setDragDateRange(undefined);
      setDefaultCreateEventValues(undefined);
      mouseHistoryRef.current = undefined;
    }, []);

  const [defaultCreateEventValues, setDefaultCreateEventValues] =
    useState<PrepareCreateEventState["defaultCreateEventValues"]>();

  const setDefaultValues: PrepareCreateEventActions["setDefaultValues"] =
    useCallback(() => {
      if (!dragDateRange) {
        return;
      }

      const { dragStartDate, dragEndDate } = dragDateRange;

      if (dragStartDate.getTime() !== dragEndDate.getTime()) {
        const eventStart = min([dragStartDate, dragEndDate]);
        const eventEnd = max([dragStartDate, dragEndDate]);

        setDefaultCreateEventValues({
          allDay: false,
          start: eventStart,
          end: eventEnd,
        });
      } else {
        clearState();
      }
    }, [clearState, dragDateRange]);

  const prepareCreateEventState: PrepareCreateEventState = useMemo(() => {
    return { dragDateRange, defaultCreateEventValues };
  }, [defaultCreateEventValues, dragDateRange]);

  useEffect(() => {
    const openCreateEventDialog = (e: MouseEvent) => {
      if (e.button === 0) {
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
        scroll,
        setDefaultValues,
        clearState,
      },
    }),
    [
      clearState,
      prepareCreateEventState,
      scroll,
      setDefaultValues,
      startDrag,
      updateDragEnd,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
