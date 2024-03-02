import {
  IconCheckbox,
  IconClipboardText,
  IconClockCheck,
  IconClockHour5,
  IconGridDots,
} from "@tabler/icons-react";
import { SortableTableHeader, TableHeader } from "./header";
import { EmptyTableRow } from "./empty-row";
import { TaskTableRow } from "./row";
import { usePaginatedTasks } from "../../_contexts/tasks-provider";
import { useState } from "react";
import { Pagination } from "../pagination";

export const TaskTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const { tasks, totalTasks } = usePaginatedTasks({ page, limit: 30 });

  return (
    <div className="flex grow flex-col overflow-auto rounded-md border border-zinc-600">
      <table className="table w-full border-collapse text-left">
        <thead className="text-xs">
          <tr className="[&_th:first-child]:pl-3 [&_th:last-child]:pr-3">
            <TableHeader icon={IconCheckbox} width={80} text="状況" />
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
            <TableHeader icon={IconGridDots} width={150} text="操作" />
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
        {totalTasks > 1 && (
          <Pagination page={page} onChangePage={setPage} total={totalTasks} />
        )}
      </div>
    </div>
  );
};
