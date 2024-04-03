import { useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { createTaskInputSchema } from "../_mocks/task/api";
import { useCreateTask } from "../_queries/use-create-task";
import { z } from "zod";

const createTaskFormSchema = createTaskInputSchema.pick({ title: true });
type CreateTaskFrom = z.infer<typeof createTaskFormSchema>;

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  statusId: string;
};
export const CreateTaskBar: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  statusId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFrom>({
    defaultValues: { title: "" },
    resolver: zodResolver(createTaskFormSchema),
  });

  const createTaskMutation = useCreateTask();
  const handleCreateTask = (input: CreateTaskFrom) => {
    createTaskMutation.mutate(
      { ...input, statusId },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  const { refs, context } = useFloating({
    open: isOpen,

    onOpenChange: (open: boolean) => {
      onOpenChange(open);
      if (!open) {
        reset();
      }
    },
  });
  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={refs.setFloating}
          className="absolute bottom-8 left-0 right-0 h-12 p-2"
          {...getFloatingProps()}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex h-12  items-center rounded-md border-2 border-blue-600 bg-neutral-800">
              <button className="grid size-12 shrink-0 place-items-center border-r-2 border-blue-600 transition-colors hover:bg-white/15 focus-visible:bg-white/15 focus-visible:outline-none">
                <PlusIcon size={18} />
              </button>
              <form
                className="relative h-full w-full grow"
                onSubmit={handleSubmit(handleCreateTask)}
              >
                <input
                  autoFocus
                  className="h-full w-full bg-transparent px-4 text-sm placeholder:text-neutral-400 focus-visible:outline-none"
                  placeholder="Start typing to create a draft"
                  {...register("title")}
                />
                <AnimatePresence>
                  {errors.title && (
                    <motion.div
                      className="absolute bottom-[130%] rounded border border-red-300 bg-neutral-900  px-2 py-1 text-xs text-red-300"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                    >
                      {errors.title.message}
                      <svg
                        width="12"
                        height="8"
                        className="absolute top-full fill-red-300"
                      >
                        <path d="M 0 0 L 12 0 L 6 8 z" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
