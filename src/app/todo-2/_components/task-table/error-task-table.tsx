import { IconGhost3 } from "@tabler/icons-react";
import { TaskTableShell, taskTableCols } from "./shell";

export const ErrorTaskTable: React.FC<{ onReload?: () => void }> = ({
  onReload,
}) => {
  return (
    <TaskTableShell
      body={
        <tr>
          <td colSpan={taskTableCols}>
            <div className="mt-[100px] grid w-full place-items-center gap-2">
              <IconGhost3 size={100} />
              <div className="text-sm">タスクを読み込めませんでした</div>
              <button
                className="h-8 rounded border border-zinc-500 bg-white/15 px-2 text-xs transition-colors hover:bg-white/20"
                onClick={onReload}
              >
                更新する
              </button>
            </div>
          </td>
        </tr>
      }
    />
  );
};
