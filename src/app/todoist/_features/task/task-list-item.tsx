import { Check } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { Task } from "../../_backend/task/model";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useUpdateTaskDone } from "./use-update-task-done";

type Props = { task: Task };

export const TaskListItem: React.FC<Props> = ({ task }) => {
  const updateTaskDone = useUpdateTaskDone();

  const handleUpdateTaskDone = () => {
    updateTaskDone.mutate({ id: task.id, done: !task.done });
  };

  return (
    <div
      key={task.id}
      className="grid min-w-0 grid-cols-[auto_1fr] gap-2 border-b border-stone-200 pr-5"
    >
      <div className="pt-[10px]">
        <Checkbox checked={task.done} onChange={handleUpdateTaskDone} />
      </div>
      <div className="flex min-w-0 flex-col gap-1 py-2">
        <div className="break-all">{task.title}</div>
        <div className="truncate text-xs text-stone-500">
          {task.description}
        </div>
      </div>
    </div>
  );
};

const Checkbox: React.FC<
  CheckboxPrimitive.CheckboxProps & {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }
> = ({ checked, onChange, ...props }) => {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        "group size-5 shrink-0 rounded-full border border-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-stone-400 text-stone-100 animate-in zoom-in-125",
      )}
      {...props}
    >
      {checked ? (
        <CheckboxPrimitive.Indicator
          forceMount
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className="size-3 stroke-[4px]" />
        </CheckboxPrimitive.Indicator>
      ) : (
        <div className="grid place-items-center">
          <Check className="size-3 stroke-[4px] text-stone-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      )}
    </CheckboxPrimitive.Root>
  );
};
