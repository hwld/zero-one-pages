import {
  IconCheckbox,
  IconClipboardText,
  IconClockCheck,
  IconClockHour5,
  IconGridDots,
} from "@tabler/icons-react";
import { SortableTableHeader, LabelTableHeader, TableHeader } from "./header";
import { EmptyTableRow } from "./empty-row";
import { TaskTableRow } from "./row";
import { useTaskAction, useTasksData } from "../../_contexts/tasks-provider";
import { Pagination } from "../pagination";
import { TaskTableCheckbox } from "./checkbox";
import { useMemo } from "react";
import { usePaginatedTasks } from "../../_queries/usePaginatedTasks";

export const TaskTable: React.FC = () => {
  const {
    page,
    selectedTaskIds,
    limit,
    sortEntry,
    fieldFilters,
    selectionFilter,
    searchText,
  } = useTasksData();
  const { setPage, selectTaskIds, unselectTaskIds } = useTaskAction();

  const { data, status } = usePaginatedTasks({
    searchText,
    sortEntry,
    paginationEntry: { page, limit },
    fieldFilters,
    selectionFilter,
    selectedTaskIds,
  });

  const areAllTasksSelectedOnPage = useMemo(() => {
    if (data?.tasks.length === 0) {
      return false;
    }

    return !!data?.tasks.every((t) => selectedTaskIds.includes(t.id));
  }, [data?.tasks, selectedTaskIds]);

  const handleTogglePageTaskSelection = () => {
    const taskIds = data?.tasks.map((t) => t.id) ?? [];

    if (areAllTasksSelectedOnPage) {
      unselectTaskIds(taskIds);
    } else {
      selectTaskIds(taskIds);
    }
  };

  if (status === "error") {
    return <div>error</div>;
  } else if (status === "pending") {
    return null;
  }

  const { tasks, totalPages } = data;

  return (
    <div className="flex grow flex-col overflow-auto rounded-md border border-zinc-600">
      <table className="table w-full border-collapse text-left">
        <thead className="text-xs">
          <tr className="[&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
            <TableHeader width={50}>
              <TaskTableCheckbox
                checked={areAllTasksSelectedOnPage}
                onChange={handleTogglePageTaskSelection}
              />
            </TableHeader>
            <LabelTableHeader icon={IconCheckbox} width={80} text="状況" />
            <SortableTableHeader
              icon={IconClipboardText}
              text="タスク名"
              fieldName="title"
            />
            <SortableTableHeader
              icon={IconClockHour5}
              width={200}
              text="作成日"
              fieldName="createdAt"
            />
            <SortableTableHeader
              icon={IconClockCheck}
              width={200}
              text="達成日"
              fieldName="completedAt"
            />
            <LabelTableHeader icon={IconGridDots} width={150} text="操作" />
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && <EmptyTableRow />}
          {tasks.map((task) => {
            return <TaskTableRow key={task.id} task={task} />;
          })}
        </tbody>
      </table>
      <div className="shrink grow" />
      <div className="flex h-[60px] items-center justify-end border-t border-zinc-600 px-2">
        {totalPages > 1 && (
          <Pagination page={page} onChangePage={setPage} total={totalPages} />
        )}
      </div>
    </div>
  );
};
