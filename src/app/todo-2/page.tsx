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
import { useMemo } from "react";
import { LoadingTaskTable } from "./_components/task-table/loading-task-table";
import { ErrorTaskTable } from "./_components/task-table/error-task-table";
import { useTodo2HomeCommands } from "./commands";

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

  const { data, status } = usePaginatedTasks({
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
        return <ErrorTaskTable />;
      }
    }
  }, [data?.tasks, data?.totalPages, status]);

  useTodo2HomeCommands();

  return (
    <>
      <div className="flex flex-nowrap items-center gap-1">
        <IconHome size={18} />
        <h1 className="text-sm">今日のタスク</h1>
      </div>
      <div className="min-w-[800px] grow">
        <Card>
          <div className="flex h-full grow flex-col gap-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <TaskSearch />
                <TaskTableFilter />
              </div>
              <AddTaskButton />
            </div>
            {content}
          </div>
        </Card>
      </div>
      <TaskSelectionMenu />
    </>
  );
};

export default Page;
