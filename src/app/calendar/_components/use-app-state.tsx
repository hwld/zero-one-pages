import {
  addDays,
  endOfWeek,
  addMonths,
  startOfWeek,
  subDays,
  subMonths,
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

type CalendarType = "month" | "week";
type AppStateContext = {
  calendarType: CalendarType;
  setCalendarType: Dispatch<SetStateAction<CalendarType>>;

  dayPickerMonth: Date;
  setDayPickerMonth: Dispatch<SetStateAction<Date>>;

  viewDate: Date;
  changeViewDate: (date: Date) => void;

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
  const [calendarType, setCalendarType] = useState<CalendarType>("week");
  const [viewDate, setViewDate] = useState(new Date());
  const [dayPickerMonth, setDayPickerMonth] = useState(viewDate);

  const changeViewDate = useCallback((date: Date) => {
    setDayPickerMonth(date);
    setViewDate(date);
  }, []);

  const nextCalendarPage = useCallback(() => {
    switch (calendarType) {
      case "week": {
        const newDate = addDays(endOfWeek(viewDate), 1);
        changeViewDate(newDate);
        return;
      }
      case "month": {
        const newDate = addMonths(viewDate, 1);
        changeViewDate(newDate);
        return;
      }
      default: {
        throw new Error(calendarType satisfies never);
      }
    }
  }, [calendarType, changeViewDate, viewDate]);

  const prevCalendarPage = useCallback(() => {
    switch (calendarType) {
      case "week": {
        const newDate = subDays(startOfWeek(viewDate), 1);
        changeViewDate(newDate);
        return;
      }
      case "month": {
        const newDate = subMonths(viewDate, 1);
        changeViewDate(newDate);
        return;
      }
      default: {
        throw new Error(calendarType satisfies never);
      }
    }
  }, [calendarType, changeViewDate, viewDate]);

  const goTodayCalendarPage = useCallback(() => {
    changeViewDate(new Date());
  }, [changeViewDate]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return false;
      }

      if (event.key === "W" || event.key === "w") {
        setCalendarType("week");
      } else if (event.key === "M" || event.key === "m") {
        setCalendarType("month");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const value: AppStateContext = useMemo(
    () => ({
      calendarType,
      setCalendarType,

      viewDate,
      changeViewDate,

      dayPickerMonth,
      setDayPickerMonth,

      nextCalendarPage,
      prevCalendarPage,
      goTodayCalendarPage,
    }),
    [
      calendarType,
      changeViewDate,
      dayPickerMonth,
      goTodayCalendarPage,
      nextCalendarPage,
      prevCalendarPage,
      viewDate,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
