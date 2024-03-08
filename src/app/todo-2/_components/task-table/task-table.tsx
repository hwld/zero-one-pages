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

export const TaskTable: React.FC = () => {
  const { page, totalTasks, paginatedTasks, selectedTaskIds } = useTasksData();
  const { setPage, selectAllTasksOnPage, unselectAllTasksOnPage } =
    useTaskAction();

  const areAllTasksSelectedOnPage = useMemo(() => {
    if (paginatedTasks.length === 0) {
      return false;
    }

    return paginatedTasks.every((t) => selectedTaskIds.includes(t.id));
  }, [paginatedTasks, selectedTaskIds]);

  const handleToggleTaskSelection = () => {
    if (areAllTasksSelectedOnPage) {
      unselectAllTasksOnPage();
    } else {
      selectAllTasksOnPage();
    }
  };

  return (
    <div className="flex grow flex-col overflow-auto rounded-md border border-zinc-600">
      <table className="table w-full border-collapse text-left">
        <thead className="text-xs">
          <tr className="[&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
            <TableHeader width={80}>
              <TaskTableCheckbox
                checked={areAllTasksSelectedOnPage}
                onChange={handleToggleTaskSelection}
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
          {paginatedTasks.length === 0 && <EmptyTableRow />}
          {paginatedTasks.map((task) => {
            return <TaskTableRow key={task.id} task={task} />;
          })}
        </tbody>
      </table>
      <div className="shrink grow" />
      <div className="flex h-[60px] items-center justify-end border-t border-zinc-600 px-2">
        {totalTasks > 1 && (
          <Pagination page={page} onChangePage={setPage} total={totalTasks} />
        )}
      </div>
    </div>
  );
};
