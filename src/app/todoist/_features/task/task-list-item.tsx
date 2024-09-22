import { cn } from "../../../../lib/utils";
import type { Task } from "../../_backend/task/model";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useUpdateTaskDone } from "./use-update-task-done";
import { type IconType } from "@react-icons/all-files/lib";
import { PiDotsSixVerticalBold } from "@react-icons/all-files/pi/PiDotsSixVerticalBold";
import { PiCaretRight } from "@react-icons/all-files/pi/PiCaretRight";
import { PiCheckBold } from "@react-icons/all-files/pi/PiCheckBold";
import { PiPencilSimpleLineLight } from "@react-icons/all-files/pi/PiPencilSimpleLineLight";
import { PiCalendarPlusLight } from "@react-icons/all-files/pi/PiCalendarPlusLight";
import { PiChatLight } from "@react-icons/all-files/pi/PiChatLight";
import { PiDotsThreeOutlineLight } from "@react-icons/all-files/pi/PiDotsThreeOutlineLight";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Tooltip, TooltipDelayGroup } from "../../_components/tooltip";

type Props = { task: Task };

export const TaskListItem: React.FC<Props> = ({ task }) => {
  const updateTaskDone = useUpdateTaskDone();

  const handleUpdateTaskDone = () => {
    updateTaskDone.mutate({ id: task.id, done: !task.done });
  };

  return (
    <TooltipDelayGroup>
      <div
        key={task.id}
        className="group relative grid min-w-0 grid-cols-[auto_1fr] gap-2 border-b border-stone-200 pr-5"
      >
        <div className="absolute right-full mr-1 flex items-center pt-[9px]">
          {/* TODO: subTaskの状況に応じて表示を制御する */}
          <div className="opacity-0 transition-all group-hover:opacity-100">
            <SideButton icon={PiDotsSixVerticalBold} />
          </div>
          <Tooltip label="サブタスクを広げる" placement="top">
            <SideButton icon={PiCaretRight} />
          </Tooltip>
        </div>
        <div className="absolute right-0 flex items-center gap-1 bg-stone-50 opacity-0 transition-all group-hover:opacity-100">
          {!task.done && (
            <>
              <Tooltip placement="top" label="タスクを編集" keys={["Cmd", "E"]}>
                <ActionButton icon={PiPencilSimpleLineLight} />
              </Tooltip>
              <Tooltip placement="top" label="予定日を設定" keys={["T"]}>
                <ActionButton icon={PiCalendarPlusLight} />
              </Tooltip>
            </>
          )}
          <Tooltip placement="top" label="タスクにコメント" keys={["C"]}>
            <ActionButton icon={PiChatLight} />
          </Tooltip>
          <Tooltip placement="top" label="その他のアクション" keys={["."]}>
            <ActionButton icon={PiDotsThreeOutlineLight} />
          </Tooltip>
        </div>
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
    </TooltipDelayGroup>
  );
};

const SideButton: React.FC<{ icon: IconType }> = forwardRef<
  HTMLButtonElement,
  { icon: IconType } & ComponentPropsWithoutRef<"button">
>(function SideButton({ icon: Icon, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className="grid size-6 place-items-center rounded transition-colors hover:bg-black/5"
    >
      <Icon className="size-4" />
    </button>
  );
});

const ActionButton = forwardRef<
  HTMLButtonElement,
  { icon: IconType } & ComponentPropsWithoutRef<"button">
>(function ActionButton({ icon: Icon, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className="grid size-7 place-items-center rounded text-stone-600 transition-colors hover:bg-black/5"
    >
      <Icon className="size-6" />
    </button>
  );
});

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
        "group/checkbox size-5 shrink-0 rounded-full border border-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-stone-400 text-stone-100 animate-in zoom-in-125",
      )}
      {...props}
    >
      {checked ? (
        <CheckboxPrimitive.Indicator
          forceMount
          className={cn("flex items-center justify-center text-current")}
        >
          <PiCheckBold className="size-3 stroke-[4px]" />
        </CheckboxPrimitive.Indicator>
      ) : (
        <div className="grid place-items-center">
          <PiCheckBold className="size-3 stroke-[4px] text-stone-400 opacity-0 transition-opacity group-hover/checkbox:opacity-100" />
        </div>
      )}
    </CheckboxPrimitive.Root>
  );
};
