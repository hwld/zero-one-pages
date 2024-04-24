import { differenceInMinutes, max, min } from "date-fns";
import { DragState, minutes15Height } from "./weekly-calendar";

type Props = { data: DragState };
export const NewEvent: React.FC<Props> = ({ data }) => {
  const start = min([data.dragStart, data.dragEnd]);
  const end = max([data.dragStart, data.dragEnd]);

  const top =
    Math.floor((start.getHours() * 60 + start.getMinutes()) / 15) *
    minutes15Height;

  const height =
    Math.ceil(differenceInMinutes(end, start) / 15) * minutes15Height;

  return (
    <div
      className="absolute z-10 w-full bg-neutral-900/20"
      style={{ top, height }}
    />
  );
};
