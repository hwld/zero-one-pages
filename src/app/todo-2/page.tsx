"use client";

import { IconHome } from "@tabler/icons-react";
import clsx from "clsx";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { TaskTable } from "./_components/task-table/task-table";
import { Sidebar } from "./_components/side-bar/side-bar";
import { AddTaskButton } from "./_components/add-task-button";
import { TaskTableFilter } from "./_components/task-table/filter";
import { TaskSearch } from "./_components/task-search";
import { TaskSelectionMenu } from "./_components/task-selection-menu/task-selection-menu";

const inter = Inter({ subsets: ["latin"] });

const Page: NextPage = () => {
  return (
    <div
      className={clsx(
        inter.className,
        "flex min-h-screen gap-6 bg-zinc-900 p-6 text-zinc-300",
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
          <div className="flex justify-between gap-6">
            <div className="flex items-center gap-4">
              <TaskSearch />
              <TaskTableFilter />
            </div>
            <AddTaskButton />
          </div>
          <TaskTable />
        </div>
      </div>
      <TaskSelectionMenu />
    </div>
  );
};

export default Page;
