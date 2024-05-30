import {
  addDays,
  addMonths,
  subDays,
  subMonths,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  previousSunday,
  isSunday,
} from "date-fns";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMinuteClock } from "./use-minute-clock";

type CalendarType = { type: "month" } | { type: "range"; days: number };

export const WEEKLY_CALENDAR_TYPE = {
  type: "range",
  days: 7,
} satisfies CalendarType;

export const DAILY_CALENDAR_TYPE = {
  type: "range",
  days: 1,
} satisfies CalendarType;

export type CalendarInfo = { selectedDate: Date } & CalendarType;

type AppStateContext = {
  calendarInfo: CalendarInfo;
  changeCalendarType: (type: CalendarType) => void;

  dayPickerMonth: Date;
  setDayPickerMonth: Dispatch<SetStateAction<Date>>;

  selectDate: (date: Date) => void;
  viewDates: Date[];

  nextCalendarPage: () => void;
  prevCalendarPage: () => void;
  goTodayCalendarPage: () => void;
};

const Context = createContext<AppStateContext | undefined>(undefined);

export const useAppState = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("AppStateProviderが存在しません。");
  }
  return ctx;
};

export const AppStateProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { currentDate } = useMinuteClock();
  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo>({
    selectedDate: currentDate,
    type: "range",
    days: 7,
  });
  const [dayPickerMonth, setDayPickerMonth] = useState(
    calendarInfo.selectedDate,
  );

  const changeCalendarType = useCallback((type: CalendarType) => {
    setCalendarInfo((info) => ({ ...info, ...type }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setDayPickerMonth(date);
    setCalendarInfo((info) => ({ ...info, selectedDate: date }));
  }, []);

  const viewDates = useMemo((): Date[] => {
    switch (calendarInfo.type) {
      case "month": {
        return eachDayOfInterval({
          start: startOfMonth(calendarInfo.selectedDate),
          end: endOfMonth(calendarInfo.selectedDate),
        });
      }
      case "range": {
        // 選択している日付を範囲の最後だと仮定したときに、指定された範囲に日曜日が含まれているか判定する。
        const tempRange = {
          start: subDays(calendarInfo.selectedDate, calendarInfo.days - 1),
          end: calendarInfo.selectedDate,
        };
        // selectedDateが日曜日の場合にも日曜日が含まれていると判定させる
        const nearestSunday = isSunday(calendarInfo.selectedDate)
          ? calendarInfo.selectedDate
          : previousSunday(calendarInfo.selectedDate);
        const includesSundayInRange = isWithinInterval(
          nearestSunday,
          tempRange,
        );

        if (includesSundayInRange) {
          // 日曜日が含まれている場合には日曜日から始める
          return eachDayOfInterval({
            start: nearestSunday,
            end: addDays(nearestSunday, calendarInfo.days - 1),
          });
        } else {
          return eachDayOfInterval(tempRange);
        }
      }
      default: {
        throw new Error(calendarInfo satisfies never);
      }
    }
  }, [calendarInfo]);

  const nextCalendarPage = useCallback(() => {
    switch (calendarInfo.type) {
      case "month": {
        const newDate = addMonths(calendarInfo.selectedDate, 1);
        selectDate(newDate);
        return;
      }
      case "range": {
        selectDate(addDays(viewDates.at(-1)!, calendarInfo.days));
        return;
      }
      default: {
        throw new Error(calendarInfo satisfies never);
      }
    }
  }, [calendarInfo, selectDate, viewDates]);

  const prevCalendarPage = useCallback(() => {
    switch (calendarInfo.type) {
      case "month": {
        const newDate = subMonths(calendarInfo.selectedDate, 1);
        selectDate(newDate);
        return;
      }
      case "range": {
        selectDate(subDays(viewDates.at(0)!, calendarInfo.days));
        return;
      }
      default: {
        throw new Error(calendarInfo satisfies never);
      }
    }
  }, [calendarInfo, selectDate, viewDates]);

  const goTodayCalendarPage = useCallback(() => {
    selectDate(new Date());
  }, [selectDate]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return false;
      }

      if (event.key === "W" || event.key === "w") {
        setCalendarInfo((info) => ({ ...info, ...WEEKLY_CALENDAR_TYPE }));
      } else if (event.key === "M" || event.key === "m") {
        setCalendarInfo((info) => ({ ...info, type: "month" }));
      } else if (event.key === "D" || event.key === "d") {
        setCalendarInfo((info) => ({ ...info, ...DAILY_CALENDAR_TYPE }));
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const value: AppStateContext = useMemo(
    () => ({
      calendarInfo,
      changeCalendarType,

      selectDate,
      viewDates,

      dayPickerMonth,
      setDayPickerMonth,

      nextCalendarPage,
      prevCalendarPage,
      goTodayCalendarPage,
    }),
    [
      calendarInfo,
      changeCalendarType,
      selectDate,
      viewDates,
      dayPickerMonth,
      nextCalendarPage,
      prevCalendarPage,
      goTodayCalendarPage,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
