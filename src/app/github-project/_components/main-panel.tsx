import { useState } from "react";
import { View } from "../_mocks/view/api";
import { useMoveTask } from "../_queries/use-move-task";
import { Button } from "./button";
import { CreateTaskBar } from "./create-task-bar";
import { ListFilterIcon } from "lucide-react";
import { VIEW_ID } from "../consts";
import { ViewColumn } from "./view-column";

type Props = { view: View };
export const MainPanel: React.FC<Props> = ({ view }) => {
  const [createTaskBarState, setCreateTaskBarState] = useState({
    isOpen: false,
    statusId: "",
  });

  const moveTaskMutation = useMoveTask();
  const handleMoveToColumn = (input: { taskId: string; statusId: string }) => {
    const column = view.columns.find((c) => c.statusId === input.statusId);
    if (!column) {
      throw new Error("存在しないstatusIdが指定されました");
    }

    const bottomTask = column.tasks.at(-1);
    const bottomOrder = bottomTask ? bottomTask.order + 0.5 : 1;
    moveTaskMutation.mutate({
      viewId: VIEW_ID,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: bottomOrder,
    });
  };

  return (
    <div className="relative flex min-w-0 grow flex-col">
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-8 grow items-center rounded-md border border-neutral-600 bg-transparent pl-2 focus-within:border-blue-500">
          <ListFilterIcon size={16} className="text-neutral-400" />
          <input
            className="h-full grow bg-transparent px-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none"
            placeholder="Filter by keyword or by field"
          />
        </div>
        <div className="flex gap-2">
          <Button>Discard</Button>
          <Button color="primary">Save</Button>
        </div>
      </div>
      <div className="flex grow gap-4 overflow-x-scroll px-4 py-2">
        {view?.columns.map((column) => {
          return (
            <ViewColumn
              key={column.statusId}
              column={column}
              allColumns={view.columns}
              onMoveToColumn={handleMoveToColumn}
              onClickAddItem={() =>
                setCreateTaskBarState({
                  isOpen: true,
                  statusId: column.statusId,
                })
              }
            />
          );
        })}
      </div>
      <CreateTaskBar
        isOpen={createTaskBarState.isOpen}
        statusId={createTaskBarState.statusId}
        onOpenChange={(open) => {
          setCreateTaskBarState((s) => ({ ...s, isOpen: open }));
        }}
      />
    </div>
  );
};
