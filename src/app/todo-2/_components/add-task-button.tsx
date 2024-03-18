import { IconCommand, IconPlus } from "@tabler/icons-react";
import { TaskAddDialog } from "./task-add-dialog";
import { useEffect, useState } from "react";
import { Button } from "./button";

export const AddTaskButton: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddTask = () => {
    setIsAddDialogOpen(true);
  };

  useEffect(() => {
    const openAddDialog = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        setIsAddDialogOpen(true);
      }
    };
    window.addEventListener("keydown", openAddDialog);
    return () => window.removeEventListener("keydown", openAddDialog);
  }, []);

  return (
    <>
      <Button onClick={handleAddTask}>
        <div className="flex items-center">
          <IconPlus size={15} className="mb-[1px]" />
          <p className="text-xs">タスクを追加する</p>
        </div>
        <div className="flex items-center rounded bg-white/20 px-1 text-zinc-300 transition-colors">
          <IconCommand size={13} />
          <p className="text-[10px]">K</p>
        </div>
      </Button>
      <TaskAddDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
};
