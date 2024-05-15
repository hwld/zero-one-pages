import { DayPicker } from "./day-picker";
import { useAppState } from "./use-app-state";

type Props = {};

export const Sidebar: React.FC<Props> = () => {
  const {
    calendarType,
    viewDate,
    setViewDate,
    dayPickerMonth,
    setDayPickerMonth,
  } = useAppState();

  return (
    <div className="flex flex-col items-center border-r border-neutral-300 bg-neutral-100 p-2">
      <DayPicker
        viewDate={viewDate}
        month={dayPickerMonth}
        type={calendarType}
        onChangeViewDate={setViewDate}
        onChangeMonth={setDayPickerMonth}
      />
    </div>
  );
};
