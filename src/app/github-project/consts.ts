import { TaskStatus } from "./_mocks/task-status/store";

export const DRAG_TYPE = {
  task: "application/task",
  column: "application/column",
};

export const TASK_STATUS_COLOR_CLASS_NAMES = {
  green: "bg-green-600/20 border-green-600 text-green-500",
  orange: "bg-orange-600/20 border-orange-600 text-orange-500",
  red: "bg-red-600/20 border-red-600 text-red-400",
  purple: "bg-purple-600/20 border-purple-600 text-purple-400",
  gray: "bg-neutral-500/20 border-neutral-500 text-neutral-400",
  transparent: "bg-transparent border-transparent",
} as const satisfies Record<TaskStatus["color"], string>;
