import { max, min } from "date-fns";
import { getHeightFromInterval, getTopFromDate } from "./utils";
import { DragDateState } from "./date-column";

type Props = { data: DragDateState; date: Date };
export const NewEvent: React.FC<Props> = ({ data, date }) => {
  const startDate = data.startDate;
  const endDate = data.endDate;

  const start = min([startDate, endDate]);
  const end = max([startDate, endDate]);

  const top = getTopFromDate(start);
  const height = getHeightFromInterval({ start, end }, date);

  return (
    <div
      className="absolute z-10 w-full bg-neutral-500/15"
      style={{ top, height }}
    />
  );
};
