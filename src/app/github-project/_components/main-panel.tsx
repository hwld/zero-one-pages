import { useRef, useState } from "react";
import { View } from "../_mocks/view/api";
import { useMoveTask } from "../_queries/use-move-task";
import { Button } from "./button";
import { CreateTaskBar } from "./create-task-bar";
import { ListFilterIcon } from "lucide-react";
import { ViewColumn } from "./view-column";
import { AnimatePresence, motion } from "framer-motion";

type Props = { view: View };
export const MainPanel: React.FC<Props> = ({ view }) => {
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);

  const scrollColumnBottomRefMap = useRef(new Map<string, HTMLDivElement>());
  const handleSetScrollColumnBottomRef = (id: string, div: HTMLDivElement) => {
    scrollColumnBottomRefMap.current.set(id, div);
  };

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
      viewId: view.id,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: bottomOrder,
    });
  };

  const handleClickAddItem = (statusId: string) => {
    const ref = scrollColumnBottomRefMap.current.get(statusId);
    if (ref) {
      ref.scrollIntoView({ block: "end", inline: "center" });
    }
    setAddingColumnId(statusId);
    setCreateTaskBarState({
      isOpen: true,
      statusId,
    });
  };

  const handleCreateTaskBarOpenChange = (open: boolean) => {
    if (!open) {
      setAddingColumnId(null);
    }
    setCreateTaskBarState((s) => ({ ...s, isOpen: open }));
  };

  const handleAfterCreateTask = (statusId: string) => {
    const ref = scrollColumnBottomRefMap.current.get(statusId);
    if (ref) {
      window.setTimeout(() => {
        ref.scrollIntoView({ block: "end", inline: "center" });
      }, 0);
    }
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
      <div className="flex grow overflow-x-scroll px-4 py-2">
        <AnimatePresence initial={false}>
          {view.columns.map((column, i) => {
            return (
              <motion.div key={column.statusId} className="h-full" layout>
                <ViewColumn
                  addingColumnId={addingColumnId}
                  viewId={view.id}
                  key={column.statusId}
                  column={column}
                  allColumns={view.columns}
                  onMoveToColumn={handleMoveToColumn}
                  onClickAddItem={handleClickAddItem}
                  previousOrder={
                    view.columns[i - 1] ? view.columns[i - 1].order : 0
                  }
                  nextOrder={
                    view.columns[i + 1]
                      ? view.columns[i + 1].order
                      : column.order + 1
                  }
                  onSetScrollBottomRef={handleSetScrollColumnBottomRef}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <CreateTaskBar
        isOpen={createTaskBarState.isOpen}
        statusId={createTaskBarState.statusId}
        onOpenChange={handleCreateTaskBarOpenChange}
        onAfterCreate={handleAfterCreateTask}
      />
    </div>
  );
};
