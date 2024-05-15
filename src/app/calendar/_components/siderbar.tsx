import { DayPicker } from "./day-picker";
import { useAppState } from "./use-app-state";

type Props = {};

export const Sidebar: React.FC<Props> = () => {
  const {
    calendarType,
    dayPickerMonth,
    setDayPickerMonth,
    viewDate,
    changeViewDate,
  } = useAppState();

  return (
    <div className="flex flex-col items-center border-r border-neutral-300 bg-neutral-100 p-2">
      <DayPicker
        viewDate={viewDate}
        month={dayPickerMonth}
        type={calendarType}
        onChangeMonth={setDayPickerMonth}
        onClickDay={changeViewDate}
      />
    </div>
  );
};
