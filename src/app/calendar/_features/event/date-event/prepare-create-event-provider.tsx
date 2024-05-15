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
import { DragDateRange, MouseHistory } from "../../../utils";
import { CreateEventInput } from "../../../_mocks/api";
import { addMinutes, max, min, startOfDay } from "date-fns";
import { DATE_EVENT_MIN_MINUTES } from "./utils";
import { getDateFromY } from "./utils";

export type PrepareCreateDateEventState = {
  dragDateRange: DragDateRange | undefined;
  defaultCreateEventValues: Omit<CreateEventInput, "title"> | undefined;
};

export type PrepareCreateDateEventActions = {
  setDragDateRange: Dispatch<
    SetStateAction<PrepareCreateDateEventState["dragDateRange"]>
  >;
  startDrag: (day: Date, y: number) => void;
  updateDragEnd: (day: Date, y: number) => void;
  scroll: (scrollTop: number) => void;
  setDefaultValues: () => void;
  clearState: () => void;
};

type PrepareCreateDateEventContext = {
  prepareCreateEventState: PrepareCreateDateEventState;
  prepareCreateEventActions: PrepareCreateDateEventActions;
};

const Context = createContext<PrepareCreateDateEventContext | undefined>(
  undefined,
);

export const usePrepareCreateDateEvent = (): PrepareCreateDateEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("PrepareCreateDateEventProviderが存在しません");
  }
  return ctx;
};

export const PrepareCreateDateEventProvider: React.FC<
  { scrollableRef: RefObject<HTMLElement> } & PropsWithChildren
> = ({ scrollableRef, children }) => {
  const [dragDateRange, setDragDateRange] =
    useState<PrepareCreateDateEventState["dragDateRange"]>();

  // マウスイベントが発生したときのyとscrollableのscrollTopを保存して、スクロールされたときに
  // これを使用してdragDateRangeを更新する
  const mouseHistoryRef = useRef<MouseHistory>();

  const startDrag: PrepareCreateDateEventActions["startDrag"] = useCallback(
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
      const dragEndDate = addMinutes(dragStartDate, DATE_EVENT_MIN_MINUTES);

      setDragDateRange({ dragStartDate, dragEndDate });
    },
    [scrollableRef],
  );

  const updateDragEnd: PrepareCreateDateEventActions["updateDragEnd"] =
    useCallback(
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

  const scroll: PrepareCreateDateEventActions["scroll"] = useCallback(
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

  const clearState: PrepareCreateDateEventActions["clearState"] =
    useCallback(() => {
      setDragDateRange(undefined);
      setDefaultCreateEventValues(undefined);
      mouseHistoryRef.current = undefined;
    }, []);

  const [defaultCreateEventValues, setDefaultCreateEventValues] =
    useState<PrepareCreateDateEventState["defaultCreateEventValues"]>();

  const setDefaultValues: PrepareCreateDateEventActions["setDefaultValues"] =
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

  const prepareCreateEventState: PrepareCreateDateEventState = useMemo(() => {
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

  const value: PrepareCreateDateEventContext = useMemo(
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
