"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "../../_components/dialog";
import { Button } from "../../_components/button";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { IconButton } from "../../_components/icon-button";
import { PiDotsThreeOutlineLight } from "@react-icons/all-files/pi/PiDotsThreeOutlineLight";
import { PiXLight } from "@react-icons/all-files/pi/PiXLight";
import { PiCaretDownLight } from "@react-icons/all-files/pi/PiCaretDownLight";
import { PiCaretUpLight } from "@react-icons/all-files/pi/PiCaretUpLight";
import { Tooltip, TooltipDelayGroup } from "../../_components/tooltip";
import { useTask } from "../../_features/task/use-task";
import { TaskCheckbox } from "../../_features/task/task-checkbox";
import { useUpdateTaskDone } from "../../_features/task/use-update-task-done";
import clsx from "clsx";
import { Separator } from "../../_components/separator";
import type { IconType } from "@react-icons/all-files";
import { PiCalendarLight } from "@react-icons/all-files/pi/PiCalendarLight";
import { PiFlagLight } from "@react-icons/all-files/pi/PiFlagLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiLockLight } from "@react-icons/all-files/pi/PiLockLight";
import { PiPaperclipLight } from "@react-icons/all-files/pi/PiPaperclipLight";
import type { ReactNode } from "react";
import { UserIcon } from "../../_components/user-icon";

const ModalTaskPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");

  const handleClose = () => {
    router.back();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog isOpen={true} onOpenChange={handleOpenChange} width={860}>
      <TooltipDelayGroup>
        <div className="grid h-12 grid-cols-[1fr_auto] items-center gap-4 border-b border-stone-200 px-2">
          <div className="w-min">
            <Button color="transparent" leftIcon={PiTrayLight}>
              インボックス
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip label="前のタスク" keys={["K"]} placement="top">
              <IconButton icon={PiCaretUpLight} />
            </Tooltip>
            <Tooltip label="次のタスク" keys={["J"]} placement="top">
              <IconButton icon={PiCaretDownLight} />
            </Tooltip>
            <Tooltip label="その他のアクション" placement="top">
              <IconButton icon={PiDotsThreeOutlineLight} />
            </Tooltip>
            <Tooltip label="タスクを閉じる" placement="top">
              <IconButton icon={PiXLight} onClick={handleClose} />
            </Tooltip>
          </div>
        </div>
        <div className="grid h-[750px] grid-cols-[1fr_auto]">
          <div className="overflow-auto">
            {taskId ? <TaskDetail taskId={taskId} /> : null}
          </div>
          <div className="w-[250px] rounded-br-lg bg-stone-100">
            <Sidebar />
          </div>
        </div>
      </TooltipDelayGroup>
    </Dialog>
  );
};
export default ModalTaskPage;

const TaskDetail: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { data: task, status } = useTask(taskId);
  const udpateDone = useUpdateTaskDone();

  const handleUpdateTaskDone = (done: boolean) => {
    udpateDone.mutate({ id: taskId, done });
  };

  if (status === "pending") {
    return null;
  }

  if (status === "error") {
    return <div>error</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      <div className="grid grid-cols-[24px_1fr] items-start gap-2">
        <TaskCheckbox checked={task.done} onChange={handleUpdateTaskDone} />
        <div className="flex flex-col gap-2">
          <p
            className={clsx(
              "break-all text-lg font-bold leading-5",
              task.done && "line-through",
            )}
          >
            {task.title}
          </p>
          <p className="break-all">{task.description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 pl-[32px]">
        <div className="w-min">
          <Button leftIcon={PiPlusLight} color="transparent">
            サブタスクを追加
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
          <UserIcon />
          <button className="flex h-8 items-center justify-between rounded-full border border-stone-300 px-2">
            <p className="text-stone-500">コメント</p>
            <PiPaperclipLight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="p-4 text-xs">
      <div className="flex flex-col gap-2">
        <SidebarSelect
          title="プロジェクト"
          icon={PiTrayLight}
          label="インボックス"
        />
        <Separator />
        <SidebarSelect title="予定日" icon={PiCalendarLight} label="9月26日" />
        <Separator />
        <SidebarSelect title="優先度" icon={PiFlagLight} label="P4" />
        <Separator />
        <SidebarItem label="ラベル" icon={PiPlusLight} />
        <Separator />
        <SidebarItem label="リマインダー" icon={PiPlusLight} />
        <Separator />
        <SidebarItem
          label={
            <p className="flex items-center gap-1">
              位置情報
              <span className="flex h-[15px] items-center rounded bg-orange-100 px-1 text-[10px] font-bold text-orange-800">
                アップグレード
              </span>
            </p>
          }
          icon={PiLockLight}
        />
      </div>
    </div>
  );
};

const sidebarItemClass =
  "flex h-7 items-center justify-between gap-2 rounded px-1 transition-colors hover:bg-rose-100/70";

const SidebarSelect: React.FC<{
  title: string;
  icon: IconType;
  label: string;
}> = ({ title, label, icon: Icon }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-medium">{title}</p>
      <button className={clsx(sidebarItemClass, "group")}>
        <div className="flex items-center gap-1">
          <Icon className="size-4" />
          <p>{label}</p>
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <PiCaretDownLight className="size-4" />
        </div>
      </button>
    </div>
  );
};

const SidebarItem: React.FC<{ label: ReactNode; icon: IconType }> = ({
  label,
  icon: Icon,
}) => {
  return (
    <button className={clsx(sidebarItemClass)}>
      {label}
      <Icon className="size-4" />
    </button>
  );
};
