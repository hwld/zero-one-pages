import { AnimatePresence, motion } from "framer-motion";
import * as RadixDialog from "@radix-ui/react-dialog";
import { ActivityIcon, CircleAlertIcon, TextIcon, XIcon } from "lucide-react";
import { TaskStatusBadge } from "../task-status-badge";
import { TaskDescriptionForm } from "./task-description-form";
import { useUpdateTask } from "../../_queries/use-update-task";
import { forwardRef, useMemo } from "react";
import { useTask } from "../../_queries/use-task";
import { BounceDot } from "../task-list-loading";

type Props = {
  taskId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TaskDetailSheet = forwardRef<HTMLDivElement, Props>(
  function TaskDetailSheet({ taskId, isOpen, onOpenChange }, ref) {
    const { data: task, status: taskStatus } = useTask(taskId);

    const updateTaskMutation = useUpdateTask();

    const content = useMemo(() => {
      if (taskStatus === "pending") {
        return (
          <motion.div
            className="flex h-full items-center justify-center gap-2"
            exit={{ opacity: 0 }}
            key="loading"
          >
            <BounceDot delay={0} />
            <BounceDot delay={0.2} />
            <BounceDot delay={0.4} />
          </motion.div>
        );
      } else if (taskStatus === "error" || !task) {
        return (
          <div className="grid h-full place-content-center place-items-center gap-2">
            <CircleAlertIcon size={50} className="text-red-500" />
            <div className="font-bold">
              タスクを読み込むことができませんでした。
            </div>
            <button
              className="rounded bg-neutral-700 px-3 py-2 text-sm text-neutral-100 transition-colors hover:bg-neutral-600"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              詳細ページを閉じる
            </button>
          </div>
        );
      }

      return (
        <>
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">title</div>
            <div className="text-2xl font-bold">{task.title}</div>
            <div className="text-xs text-neutral-500">ID: {task.id}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <ActivityIcon size={18} />
              <div>状態</div>
            </div>
            <div className="ml-2">
              <TaskStatusBadge
                done={task.done}
                onChangeDone={() => {
                  updateTaskMutation.mutate({
                    ...task,
                    done: !task.done,
                  });
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              className="flex items-center gap-1 text-sm text-neutral-500"
              htmlFor="description"
            >
              <TextIcon size={18} />
              <div>説明</div>
            </label>
            <TaskDescriptionForm
              id="description"
              defaultDescription={task.description}
              onChangeDescription={(desc) => {
                updateTaskMutation.mutate({
                  ...task,
                  description: desc,
                });
              }}
            />
          </div>
        </>
      );
    }, [onOpenChange, task, taskStatus, updateTaskMutation]);

    return (
      <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {isOpen && (
            <RadixDialog.Portal forceMount>
              <RadixDialog.Overlay forceMount asChild>
                <motion.div
                  className="fixed inset-0 bg-black/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </RadixDialog.Overlay>

              <RadixDialog.Content forceMount asChild>
                <motion.div
                  ref={ref}
                  className="fixed bottom-0 right-0 top-0 z-10 w-[450px] max-w-full p-3"
                  tabIndex={undefined}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="relative flex h-full w-full flex-col gap-6 overflow-auto rounded-lg border-neutral-300 bg-neutral-100 p-6 text-neutral-700 [&_*]:outline-neutral-900">
                    <RadixDialog.Close asChild>
                      <button
                        className="absolute right-3 top-3 rounded p-1 text-neutral-700 transition-colors hover:bg-black/5"
                        aria-label="シートを閉じる"
                      >
                        <XIcon />
                      </button>
                    </RadixDialog.Close>
                    <AnimatePresence mode="popLayout">
                      {content}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </RadixDialog.Content>
            </RadixDialog.Portal>
          )}
        </AnimatePresence>
      </RadixDialog.Root>
    );
  },
);
