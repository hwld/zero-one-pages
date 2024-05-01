import { max, min } from "date-fns";
import { getHeightFromDate, getTopFromDate } from "./utils";
import { DragDateState } from "./date-column";

type Props = { data: DragDateState };
export const NewEvent: React.FC<Props> = ({ data }) => {
  const startDate = data.startDate;
  const endDate = data.endDate;

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
