"use client";
import { motion, useAnimate } from "framer-motion";
import * as RadixDialog from "@radix-ui/react-dialog";
import { ActivityIcon, TextIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useTask } from "../_queries/useTask";
import { useUpdateTask } from "../_queries/useUpdateTask";
import { TaskStatusBadge } from "../_components/task-status-badge";
import { TaskDescriptionForm } from "../_components/task-detail-sheet/task-description-form";

const DetailModalPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const taskId = z.string().parse(params.get("id"));
  const { data: task } = useTask(taskId);
  const updateTaskMutation = useUpdateTask();

  const [scope, animate] = useAnimate();
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      return;
    }

    await animate(scope.current, { x: 20, opacity: 0 });
    router.replace("/todo-1");
  };

  // TODO:
  if (!task) {
    return null;
  }

  return (
    <RadixDialog.Root open onOpenChange={handleOpenChange}>
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
            ref={scope}
            className="fixed bottom-0 right-0 top-0 z-10 w-[450px] max-w-full p-3"
            tabIndex={undefined}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="relative flex h-full w-full flex-col gap-6 overflow-auto rounded-lg border-neutral-300 bg-neutral-100 p-6 text-neutral-700 [&_*]:outline-neutral-900">
              <RadixDialog.Close asChild>
                <button className="absolute right-3 top-3 rounded p-1 text-neutral-700 transition-colors hover:bg-black/5">
                  <XIcon />
                </button>
              </RadixDialog.Close>
              <div className="space-y-1">
                <div className="text-xs text-neutral-500">task-title</div>
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
                <div className="flex items-center gap-1 text-sm text-neutral-500">
                  <TextIcon size={18} />
                  <div>説明</div>
                </div>
                <TaskDescriptionForm
                  defaultDescription={task.description}
                  onChangeDescription={(desc) => {
                    updateTaskMutation.mutate({
                      ...task,
                      description: desc,
                    });
                  }}
                />
              </div>
            </div>
          </motion.div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default DetailModalPage;
