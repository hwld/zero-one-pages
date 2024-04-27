import { max, min } from "date-fns";
import { DragDateState } from "./weekly-calendar";
import { getDateFromY, getHeightFromDate, getTopFromDate } from "./utils";

type Props = { data: DragDateState };
export const NewEvent: React.FC<Props> = ({ data }) => {
  const startDate = getDateFromY(data.targetDate, data.dragStartY);
  const endDate = getDateFromY(data.targetDate, data.dragEndY);

  const start = min([startDate, endDate]);
  const end = max([startDate, endDate]);

  const top = getTopFromDate(start);
  const height = getHeightFromDate({ start, end });

  return (
    <div
      className="absolute z-10 w-full bg-neutral-900/20"
      style={{ top, height }}
    />
  );
};
