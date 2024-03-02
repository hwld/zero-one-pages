import {
  IconCheckbox,
  IconClipboardText,
  IconClockCheck,
  IconClockHour5,
  IconGridDots,
} from "@tabler/icons-react";
import { Task } from "../../page";
import { TableHeader } from "./header";
import { EmptyTableRow } from "./empty-row";
import { TaskTableRow } from "./row";

type TableProps = {
  tasks: Task[];
};
export const TaskTable: React.FC<TableProps> = ({ tasks }) => {
  return (
    <div className="overflow-auto rounded-md border border-zinc-600">
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
            return <TaskTableRow key={task.id} task={task} />;
          })}
        </tbody>
      </table>
    </div>
  );
};
