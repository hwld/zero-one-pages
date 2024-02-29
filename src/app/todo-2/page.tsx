"use client";

import { IconHome } from "@tabler/icons-react";
import clsx from "clsx";
import { SearchIcon } from "lucide-react";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { useState } from "react";
import { TaskTable } from "./_components/task-table/task-table";
import { Sidebar } from "./_components/side-bar/side-bar";
import { AddTaskButton } from "./_components/add-task-button";

const inter = Inter({ subsets: ["latin"] });

export type Task = {
  id: string;
  title: string;
  status: "done" | "todo";
  createdAt: string;
  completedAt: string;
};

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
                <input className="h-8 w-[400px] rounded border border-gray-500 bg-transparent py-1 pl-7 text-sm focus-within:border-gray-300 focus-within:outline-none" />
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
  );
};

export default Page;
