import { useMergeRefs } from "@floating-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircleIcon, CommandIcon, Loader2Icon } from "lucide-react";
import { FocusEventHandler, forwardRef, useId } from "react";
import { useForm } from "react-hook-form";
import { useAddTask } from "../_queries/use-add-task";
import { CreateTaskInput, createTaskInputSchema } from "../_backend/api";

export const TaskCreateInput = forwardRef<HTMLInputElement, {}>(
  function TaskForm({}, _inputRef) {
    const {
      register,
      formState: { errors },
      handleSubmit: buildHandleSubmit,
      clearErrors,
      reset,
    } = useForm<CreateTaskInput>({
      defaultValues: { title: "" },
      resolver: zodResolver(createTaskInputSchema),
    });
    const addTaskMutation = useAddTask();
    const { ref, onBlur, ...otherRegister } = register("title");
    const inputRef = useMergeRefs([_inputRef, ref]);

    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      onBlur(e);
      clearErrors("title");
    };

    const handleSubmit = buildHandleSubmit((data: CreateTaskInput) => {
      if (addTaskMutation.isPending) {
        return;
      }

      addTaskMutation.mutate(data);
      reset({ title: "" });
    });

    const errorMessageId = useId();

    return (
      <Popover.Root open={!!errors.title}>
        <Popover.Anchor asChild>
          <div className="flex h-[50px] w-[300px] max-w-full items-center justify-center overflow-hidden rounded-full bg-neutral-900 shadow-lg  shadow-neutral-800/20 ring-neutral-900 ring-offset-2 ring-offset-neutral-100 transition-all duration-300 ease-in-out focus-within:w-[650px] focus-within:ring">
            <form onSubmit={handleSubmit} className="h-full w-full">
              <input
                ref={inputRef}
                className="h-full w-full bg-transparent pl-5  pr-2 text-neutral-200 placeholder:text-neutral-400 focus:outline-none"
                placeholder="タスクを入力してください..."
                onBlur={handleBlur}
                aria-invalid={!!errors.title}
                aria-errormessage={errorMessageId}
                {...otherRegister}
              />
            </form>
            <div className="relative mr-2 grid h-[36px] w-[45px] place-items-center gap-1 rounded-full border border-neutral-500 bg-white/20 p-2 duration-300">
              <motion.div
                className="absolute grid size-full place-items-center text-neutral-100"
                initial={{ opacity: 0, y: -10 }}
                animate={
                  addTaskMutation.isPending
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0 }
                }
                exit={{ opacity: 0, y: -10 }}
              >
                <Loader2Icon className="size-5 animate-spin" />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex size-full items-center justify-center text-neutral-50"
                initial={
                  addTaskMutation.isPending ? { opacity: 0, y: 10 } : false
                }
                animate={
                  addTaskMutation.isPending
                    ? { opacity: 0 }
                    : { opacity: 1, y: 0 }
                }
                exit={{ opacity: 0, y: 10 }}
              >
                <CommandIcon size={15} />
                <div className="select-none text-sm">K</div>
              </motion.div>
            </div>
          </div>
        </Popover.Anchor>
        <AnimatePresence>
          {errors.title && (
            <Popover.Portal forceMount>
              <Popover.Content
                onOpenAutoFocus={(e) => e.preventDefault()}
                side="top"
                sideOffset={4}
                asChild
                id={errorMessageId}
              >
                <motion.div
                  className="flex items-center gap-1 rounded bg-neutral-900 p-2 text-xs text-red-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <AlertCircleIcon size={18} />
                  {errors.title.message}
                  <Popover.Arrow className="fill-neutral-900" />
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          )}
        </AnimatePresence>
      </Popover.Root>
    );
  },
);
