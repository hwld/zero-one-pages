"use client";

import { IconHome } from "@tabler/icons-react";
import { NextPage } from "next";
import { TaskTable } from "./_components/task-table/task-table";
import { AddTaskButton } from "./_components/add-task-button";
import { TaskTableFilter } from "./_components/task-table/filter";
import { TaskSearch } from "./_components/task-search";
import { TaskSelectionMenu } from "./_components/task-selection-menu/task-selection-menu";
import { Card } from "./_components/card";
import { useTasksData } from "./_contexts/tasks-provider";
import { usePaginatedTasks } from "./_queries/usePaginatedTasks";
import { useMemo, useState } from "react";
import { LoadingTaskTable } from "./_components/task-table/loading-task-table";
import { ErrorTaskTable } from "./_components/task-table/error-task-table";
import { useGlobalCommandConfig } from "../global-command";
import {
  BoxSelectIcon,
  RefreshCcwIcon,
  TriangleAlertIcon,
  TriangleIcon,
} from "lucide-react";
import { taskStore } from "./_mocks/task-store";

const Page: NextPage = () => {
  const {
    page,
    selectedTaskIds,
    limit,
    sortEntry,
    fieldFilters,
    selectionFilter,
    searchText,
  } = useTasksData();

  const { data, status, refetch } = usePaginatedTasks({
    searchText,
    sortEntry,
    paginationEntry: { page, limit },
    fieldFilters,
    selectionFilter,
    selectedTaskIds,
  });

  const content = useMemo(() => {
    switch (status) {
      case "success": {
        return (
          <TaskTable paginatedTasks={data.tasks} totalPages={data.totalPages} />
        );
      }
      case "pending": {
        return <LoadingTaskTable />;
      }
      case "error": {
        return <ErrorTaskTable onReload={refetch} />;
      }
    }
  }, [data?.tasks, data?.totalPages, refetch, status]);

  const [error, setError] = useState(false);
  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            id: crypto.randomUUID(),
            icon: error ? TriangleIcon : TriangleAlertIcon,
            label: error
              ? "タスク取得エラーを止める"
              : "タスク取得エラーを発生させる",
            action: async () => {
              setError((s) => !s);
              if (error) {
                taskStore.stopSimulateError();
              } else {
                taskStore.simulateError();
              }
              refetch();
            },
          },
          {
            id: crypto.randomUUID(),
            icon: BoxSelectIcon,
            label: "タスクを空にする",
            action: async () => {
              taskStore.clear();
              refetch();
            },
          },
          {
            id: crypto.randomUUID(),
            icon: RefreshCcwIcon,
            label: "タスクを初期化する",
            action: async () => {
              taskStore.reset();
              refetch();
            },
          },
        ],
      };
    }, [error, refetch]),
  );

  return (
    <>
      <div className="flex flex-nowrap items-center gap-1">
        <IconHome size={18} />
        <h1 className="text-sm">今日のタスク</h1>
      </div>
      <Card>
        <div className="flex h-full grow flex-col gap-4">
          <div className="flex justify-between gap-6">
            <div className="flex items-center gap-4">
              <TaskSearch />
              <TaskTableFilter />
            </div>
            <AddTaskButton />
          </div>
          {content}
        </div>
      </Card>
      <TaskSelectionMenu />
    </>
  );
};

export default Page;
