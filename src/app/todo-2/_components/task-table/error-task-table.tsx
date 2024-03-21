import { IconGhost3 } from "@tabler/icons-react";
import { TaskTableShell, taskTableCols } from "./shell";
import { Button } from "../button";

export const ErrorTaskTable: React.FC = () => {
  return (
    <TaskTableShell
      body={
        <tr>
          <td colSpan={taskTableCols}>
            <div className="mt-[100px] grid w-full place-items-center gap-2">
              <IconGhost3 size={100} />
              <div className="text-sm">タスクを読み込めませんでした</div>
              <Button
                onClick={() => {
                  window.location.reload();
                }}
              >
                更新する
              </Button>
            </div>
          </td>
        </tr>
      }
    />
  );
};
