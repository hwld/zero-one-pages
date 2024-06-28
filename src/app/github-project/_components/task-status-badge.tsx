import clsx from "clsx";
import { TaskStatus } from "../_backend/task-status/store";
import { TASK_STATUS_COLOR_CLASS_NAMES } from "../consts";

type Props = { status: TaskStatus };

export const TaskStatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <div
      className={clsx(
        "flex h-5 w-fit items-center rounded-full border px-[6px] text-xs",
        TASK_STATUS_COLOR_CLASS_NAMES[status.color],
      )}
    >
      {status.name}
    </div>
  );
};
