import { max, min } from "date-fns";
import { getHeightFromInterval, getTopFromDate } from "./utils";
import { EventCreationDragData } from "./date-column";

type Props = { eventCreationDragData: EventCreationDragData; date: Date };
export const NewEvent: React.FC<Props> = ({ eventCreationDragData, date }) => {
  const startDate = eventCreationDragData.startDate;
  const endDate = eventCreationDragData.endDate;

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
