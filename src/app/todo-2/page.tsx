"use client";

import { IconHome } from "@tabler/icons-react";
import { NextPage } from "next";
import { TaskTable } from "./_components/task-table/task-table";
import { AddTaskButton } from "./_components/add-task-button";
import { TaskTableFilter } from "./_components/task-table/filter";
import { TaskSearch } from "./_components/task-search";
import { TaskSelectionMenu } from "./_components/task-selection-menu/task-selection-menu";
import { Card } from "./_components/card";
import { useQuery } from "@tanstack/react-query";
import { fetchPaginatedTasks } from "./_mocks/api";

const Page: NextPage = () => {
  const { data, status, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => {
      return fetchPaginatedTasks({
        fieldFilters: [],
        paginationEntry: { page: 1, limit: 30 },
        searchText: "",
        selectedTaskIds: [],
        selectionFilter: null,
        sortEntry: { field: "createdAt", order: "desc" },
      });
    },
  });
  console.log(data, status, error);

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
          <TaskTable />
        </div>
      </Card>
      <TaskSelectionMenu />
    </>
  );
};

export default Page;
