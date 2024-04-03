import clsx from "clsx";
import { TaskStatus } from "../_mocks/task-status/store";

type Props = { color: TaskStatus["color"] };
export const TaskStatusIcon: React.FC<Props> = ({ color }) => {
  const iconClass = {
    green: "bg-green-600/20 border-green-600",
    orange: "bg-orange-600/20 border-orange-600",
    red: "bg-red-600/20 border-red-600",
    purple: "bg-purple-600/20 border-purple-600",
    gray: "bg-neutral-500/20 border-neutral-500",
    transparent: "bg-transparent border-transparent",
  };

  return (
    <div
      className={clsx(
        "size-4 shrink-0 rounded-full border-2",
        iconClass[color],
      )}
    />
  );
};
