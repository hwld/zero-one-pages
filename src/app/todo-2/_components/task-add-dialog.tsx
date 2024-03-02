import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, XIcon } from "lucide-react";
import { useTaskAction } from "../_contexts/tasks-provider";
import { TaskForm, TaskFormData } from "./task-form";
import { useState } from "react";

const taskFormId = "task-form-id";

type Props = { isOpen: boolean; onOpenChange: (open: boolean) => void };
export const TaskAddDialog: React.FC<Props> = ({ isOpen, onOpenChange }) => {
  const [formkey, setFormKey] = useState(crypto.randomUUID());
  const [moreAdd, setmoreAdd] = useState(false);
  const { addTask } = useTaskAction();

  const handleAddTask = (data: TaskFormData) => {
    addTask({ title: data.title, description: data.description });
    setFormKey(crypto.randomUUID());

    if (!moreAdd) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
            </DialogOverlay>
            <DialogContent asChild>
              <motion.div
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
                className="fixed left-1/2 top-1/2 w-full max-w-[550px] overflow-hidden rounded border border-zinc-700 bg-zinc-800 text-zinc-100"
              >
                <div className="flex justify-between p-4">
                  <div className="grid select-none place-items-center rounded bg-zinc-700 px-2 text-xs text-zinc-400">
                    New Task
                  </div>
                  <DialogClose className="grid size-[25px] place-items-center rounded transition-colors hover:bg-white/10">
                    <XIcon size={20} />
                  </DialogClose>
                </div>
                <TaskForm
                  key={formkey}
                  id={taskFormId}
                  onAddTask={handleAddTask}
                />
                <div className="h-[1px] w-full bg-zinc-700" />
                <div className="flex justify-end gap-4 p-3">
                  <div className="flex items-center gap-2">
                    <input
                      checked={moreAdd}
                      onChange={() => setmoreAdd((s) => !s)}
                      type="checkbox"
                      id="switch"
                      className="relative block h-[20px] w-[35px] appearance-none rounded-full bg-zinc-500 before:absolute before:top-[3px] before:h-[14px] before:w-[14px] before:translate-x-[3px] before:rounded-full before:bg-zinc-100 before:transition-transform before:content-[''] checked:bg-green-500 checked:before:translate-x-[18px]"
                    />
                    <label htmlFor="switch" className="text-xs">
                      続けて作成する
                    </label>
                  </div>
                  <button
                    className="flex min-w-[50px] items-center gap-1 rounded bg-zinc-300 p-2 text-xs text-zinc-700"
                    type="submit"
                    form={taskFormId}
                  >
                    <PlusIcon size={15} />
                    作成する
                  </button>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
