"use client";

import { UiPage } from "@/common/ui-page";
import {
  IconCalendar,
  IconCheckbox,
  IconCircleCheck,
  IconClipboardText,
  IconClockCheck,
  IconClockHour5,
  IconCommand,
  IconGridDots,
  IconHome,
  IconListDetails,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import clsx from "clsx";
import { CircleDashedIcon, CircleDotIcon, SearchIcon } from "lucide-react";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Page: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    setTasks((prev) => [
      {
        id: Math.random().toString(),
        title: "new task",
        status: "todo",
        createdAt: new Date().toLocaleString(),
        completedAt: "",
      },
      ...prev,
    ]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((p) => p.id !== id));
  };

  const handleChangeStatus = (id: string, status: Task["status"]) => {
    setTasks((tasks) =>
      tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status,
            completedAt:
              status === "done" ? new Date().toLocaleString() : "None",
          };
        }
        return t;
      }),
    );
  };

  return (
    <UiPage>
      <div
        className={clsx(
          inter.className,
          "flex min-h-[100dvh] bg-gray-900 text-gray-300",
        )}
      >
        <div className="sticky top-0 h-[100dvh] pl-5 pt-5">
          <Sidebar />
        </div>
        <div className="mx-3 my-5 flex w-full flex-col p-3">
          <div className="flex items-end justify-between">
            <div className="flex flex-nowrap items-center gap-1">
              <IconHome size={18} />
              <h1 className="text-sm">今日のタスク</h1>
            </div>
          </div>
          <div className="mt-3 flex w-full  grow flex-col gap-4 rounded-lg bg-gray-800 p-8 shadow-2xl">
            <div className="flex justify-between gap-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <SearchIcon
                    className="pointer-events-none absolute left-2 top-[50%] -translate-y-[50%]"
                    size={18}
                  />
                  <input className="h-8 w-[400px] rounded border border-gray-400 bg-transparent py-1 pl-7 text-sm focus-within:border-gray-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300" />
                </div>
                <button className="h-8 shrink-0 rounded bg-gray-300 px-3 py-1 text-xs text-gray-700">
                  検索
                </button>
              </div>
              <AddTaskButton onClick={handleAddTask} />
            </div>
            <TaskTable
              tasks={tasks}
              onDeleteTask={handleDeleteTask}
              onChangeStatus={handleChangeStatus}
            />
          </div>
        </div>
      </div>
    </UiPage>
  );
};

export default Page;

const Sidebar: React.FC = () => {
  return (
    <div className="flex w-[200px] flex-col">
      <div className="flex items-center gap-1 whitespace-nowrap text-sm font-bold">
        <IconCircleCheck />
        <p>evodo-openapi</p>
      </div>
      <div className="mt-6 flex flex-col gap-1">
        <SidebarItem icon={IconHome} label="今日のタスク" />
        <SidebarItem icon={IconListDetails} label="過去のタスク" />
        <SidebarItem icon={IconCalendar} label="予定" />
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{
  icon: React.FC<{ size?: number }>;
  label: string;
}> = ({ icon: Icon, label }) => {
  return (
    <div className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md p-2 text-sm text-gray-200 transition-colors hover:bg-white/20">
      <Icon size={25} />
      <p>{label}</p>
    </div>
  );
};

const AddTaskButton: React.FC<ComponentPropsWithoutRef<"button">> = ({
  onClick,
}) => {
  return (
    <button
      className="group flex h-8 w-fit shrink-0 items-center gap-2 rounded bg-gray-300 px-2 text-gray-700 transition-colors hover:bg-gray-400"
      onClick={onClick}
    >
      <div className="flex items-center">
        <IconPlus size={15} className="mb-[1px]" />
        <p className="text-xs">タスクを追加する</p>
      </div>
      <div className="flex items-center rounded bg-black/15 px-1 py-[2px] text-gray-700 transition-colors">
        <IconCommand size={15} />
        <p className="mt-[1px] text-[12px]">K</p>
      </div>
    </button>
  );
};

type TableProps = {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onChangeStatus: (id: string, status: Task["status"]) => void;
};
const TaskTable: React.FC<TableProps> = ({
  tasks,
  onDeleteTask,
  onChangeStatus,
}) => {
  return (
    <div className="overflow-auto rounded-md border border-gray-600">
      <table className="table w-full border-collapse text-left">
        <thead className="text-xs">
          <tr className="[&_th:first-child]:pl-3 [&_th:last-child]:pr-3">
            <TableHeader icon={IconCheckbox} width={80} text="状況" />
            <TableHeader icon={IconClipboardText} text="タスク名" />
            <TableHeader icon={IconClockHour5} width={200} text="作成日" />
            <TableHeader icon={IconClockCheck} width={200} text="達成日" />
            <TableHeader icon={IconGridDots} width={150} text="操作" />
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {tasks.length === 0 && <EmptyTableRow />}
          {tasks.map((task) => {
            return (
              <TaskTableRow
                key={task.id}
                task={task}
                onDeleteTask={onDeleteTask}
                onChangeStatus={(val) => onChangeStatus(task.id, val)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const TableHeader: React.FC<{
  icon?: React.FC<{ size?: number; className?: string }>;
  text: string;
  width?: number;
}> = ({ icon: Icon, text, width }) => {
  return (
    <th
      className="whitespace-nowrap border-b border-gray-600 bg-black/10 p-3 font-medium text-gray-400"
      style={{ width }}
    >
      <div className="text-m flex items-center gap-1">
        {Icon && <Icon size={18} />}
        <div>{text}</div>
      </div>
    </th>
  );
};

type Task = {
  id: string;
  title: string;
  status: "done" | "todo";
  createdAt: string;
  completedAt: string;
};
const TaskTableRow: React.FC<{
  task: Task;
  onDeleteTask: (id: string) => void;
  onChangeStatus: (value: Task["status"]) => void;
}> = ({
  task: { id, title, status, createdAt, completedAt },
  onDeleteTask,
  onChangeStatus,
}) => {
  const handleDelete = () => {
    onDeleteTask(id);
  };

  return (
    <tr className="border-b border-gray-600 transition-colors hover:bg-white/5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5">
      <TaskTableData noWrap>
        <TaskStatusBadge status={status} onChangeStatus={onChangeStatus} />
      </TaskTableData>
      <TaskTableData>{title}</TaskTableData>
      <TaskTableData noWrap>{createdAt}</TaskTableData>
      <TaskTableData noWrap>{completedAt || "None"}</TaskTableData>
      <TaskTableData>
        <div className="flex gap-2">
          <button className="rounded px-2 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-500">
            <IconPencil size={16} />
          </button>
          <button
            className="rounded px-2 py-1  text-xs text-gray-300 transition-colors hover:bg-gray-500"
            onClick={handleDelete}
          >
            <IconTrash size={16} />
          </button>
        </div>
      </TaskTableData>
    </tr>
  );
};

type TaskStatusBadgeProps = {
  status: Task["status"];
  onChangeStatus: (value: Task["status"]) => void;
};
const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  onChangeStatus,
}) => {
  const statusClassMap = {
    done: "border-green-500 text-green-500 hover:bg-green-500/20",
    todo: "border-red-500 text-red-500 hover:bg-red-500/20",
  };
  const options = {
    done: { text: "完了", icon: CircleDotIcon },
    todo: { text: "未完了", icon: CircleDashedIcon },
  };

  const label = options[status].text;
  const Icon = options[status].icon;

  const handleChangeStatus = () => {
    const next = status === "done" ? "todo" : "done";
    onChangeStatus(next);
  };

  return (
    <button
      className={clsx(
        "flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors",
        statusClassMap[status],
      )}
      onClick={handleChangeStatus}
    >
      <Icon size={15} />
      {label}
    </button>
  );
};

const EmptyTableRow: React.FC = () => {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex h-[400px] w-full items-center justify-center">
          <div className="flex w-[300px] flex-col items-center gap-3 text-center">
            <IconClipboardText size={100} strokeWidth={1.5} />
            <p className="text-lg font-bold">今日やるべきことはなんですか？</p>
            <p className="w-[230px] text-sm text-gray-300">
              `Cmd+K`または`Ctrl+K`でタスクの入力を開始できます。。
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
};

const TaskTableData: React.FC<{ children: ReactNode; noWrap?: boolean }> = ({
  children,
  noWrap,
}) => {
  return (
    <td className={clsx("px-3 py-1 text-sm", noWrap && "whitespace-nowrap")}>
      <div className="">{children}</div>
    </td>
  );
};
