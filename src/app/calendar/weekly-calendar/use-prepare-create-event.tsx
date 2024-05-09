import {
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  RefObject,
  useRef,
} from "react";
import { DragDateRange } from "../utils";
import { CreateEventInput } from "../mocks/api";
import { addMinutes, max, min, startOfDay } from "date-fns";
import { EVENT_MIN_MINUTES, getDateFromY } from "./utils";

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

type Params = { scrollableElementRef: RefObject<HTMLElement> };
export const usePrepareCreateEvent = ({ scrollableElementRef }: Params) => {
  const [dragDateRange, setDragDateRange] =
    useState<PrepareCreateEventState["dragDateRange"]>();

  // マウスイベントが発生したときのyとscrollableのscrollTopを保存して、スクロールされたときに
  // これを使用してdragDateRangeを更新する
  const mouseHistoryRef = useRef<
    { prevY: number; prevScrollTop: number } | undefined
  >(undefined);

  const startDrag: PrepareCreateEventActions["startDrag"] = useCallback(
    (day, y) => {
      if (scrollableElementRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElementRef.current.scrollTop,
        };
      }

      const targetDate = startOfDay(day);

      // ドラッグ開始の時点では常にクリックした最小領域が期間として設定されるようにする
      const dragStartDate = getDateFromY(targetDate, y, "floor");
      const dragEndDate = addMinutes(dragStartDate, EVENT_MIN_MINUTES);

      setDragDateRange({ dragStartDate, dragEndDate });
    },
    [scrollableElementRef],
  );

  const updateDragEnd: PrepareCreateEventActions["updateDragEnd"] = useCallback(
    (day, y) => {
      if (!dragDateRange) {
        return;
      }

      if (scrollableElementRef.current) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElementRef.current.scrollTop,
        };
      }

      const targetDate = startOfDay(day);
      const dragEndDate = getDateFromY(targetDate, y);
      setDragDateRange({ ...dragDateRange, dragEndDate });
    },
    [dragDateRange, scrollableElementRef],
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
      }
    }, [dragDateRange]);

  const clearState: PrepareCreateEventActions["clearState"] =
    useCallback(() => {
      setDragDateRange(undefined);
      setDefaultCreateEventValues(undefined);
      mouseHistoryRef.current = undefined;
    }, []);

  const prepareCreateEventState: PrepareCreateEventState = useMemo(() => {
    return { dragDateRange, defaultCreateEventValues };
  }, [defaultCreateEventValues, dragDateRange]);

  const prepareCreateEventActions: PrepareCreateEventActions = useMemo(() => {
    return {
      setDragDateRange,
      startDrag,
      updateDragEnd,
      scroll,
      setDefaultValues,
      clearState,
    };
  }, [clearState, scroll, setDefaultValues, startDrag, updateDragEnd]);

  return { prepareCreateEventState, prepareCreateEventActions };
};
