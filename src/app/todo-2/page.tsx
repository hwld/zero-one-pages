"use client";

import { IconHome } from "@tabler/icons-react";
import clsx from "clsx";
import { SearchIcon } from "lucide-react";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { TaskTable } from "./_components/task-table/task-table";
import { Sidebar } from "./_components/side-bar/side-bar";
import { AddTaskButton } from "./_components/add-task-button";

const inter = Inter({ subsets: ["latin"] });

const Page: NextPage = () => {
  return (
    <div
      className={clsx(
        inter.className,
        "flex min-h-[100dvh] gap-6 bg-zinc-900 p-6 text-zinc-300",
      )}
    >
      <div className="sticky top-0">
        <Sidebar />
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-nowrap items-center gap-1">
          <IconHome size={18} />
          <h1 className="text-sm">今日のタスク</h1>
        </div>
        <div className="flex w-full  grow flex-col gap-4 rounded-lg bg-zinc-800 p-8 shadow-2xl">
          <div className="flex justify-between gap-1">
            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute left-2 top-[50%] -translate-y-[50%]"
                  size={18}
                />
                <input className="h-8 w-[400px] rounded border border-zinc-500 bg-transparent py-1 pl-7 text-sm focus-within:border-zinc-300 focus-within:outline-none" />
              </div>
              <button className="h-8 shrink-0 rounded bg-zinc-300 px-3 py-1 text-xs text-zinc-700">
                検索
              </button>
            </div>
            <AddTaskButton />
          </div>
          <TaskTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
