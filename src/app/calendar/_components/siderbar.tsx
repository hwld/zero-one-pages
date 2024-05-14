import { Dispatch, SetStateAction } from "react";
import { CalendarType } from "../page";
import { DayPicker } from "./day-picker";

type Props = {
  type: CalendarType;
  date: Date;
  onChangeDate: (d: Date) => void;
  month: Date;
  onChangeMonth: Dispatch<SetStateAction<Date>>;
};

export const Sidebar: React.FC<Props> = ({
  type,
  date,
  onChangeDate,
  month,
  onChangeMonth,
}) => {
  return (
    <div className="flex flex-col items-center border-r border-neutral-300 bg-neutral-100 p-2">
      <DayPicker
        date={date}
        month={month}
        type={type}
        onChangeDate={onChangeDate}
        onChangeMonth={onChangeMonth}
      />
    </div>
  );
};
