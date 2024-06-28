import clsx from "clsx";
import { TaskStatus } from "../_backend/task-status/store";
import { TASK_STATUS_COLOR_CLASS_NAMES } from "../consts";

type Props = { color: TaskStatus["color"] };
export const TaskStatusIcon: React.FC<Props> = ({ color }) => {
  return (
    <div
      className={clsx(
        "size-4 shrink-0 rounded-full border-2",
        TASK_STATUS_COLOR_CLASS_NAMES[color],
      )}
    />
  );
};
