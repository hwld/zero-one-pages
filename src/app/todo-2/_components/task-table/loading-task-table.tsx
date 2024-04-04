import { IconLoader2 } from "@tabler/icons-react";
import { TaskTableShell, taskTableCols } from "./shell";

export const LoadingTaskTable: React.FC = () => {
  return (
    <TaskTableShell
      body={
        <tr>
          <td colSpan={taskTableCols} className="h-[150px]">
            <div className="grid w-full place-items-center">
              <IconLoader2 size={100} className="animate-spin text-white/30" />
            </div>
          </td>
        </tr>
      }
    />
  );
};
