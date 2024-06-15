import { useMergeRefs } from "@floating-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircleIcon, CommandIcon } from "lucide-react";
import { FocusEventHandler, forwardRef, useId } from "react";
import { useForm } from "react-hook-form";
import { useAddTask } from "../_queries/use-add-task";
import { CreateTaskInput, createTaskInputSchema } from "../_mocks/api";

export const TaskForm = forwardRef<HTMLInputElement, {}>(function TaskForm(
  {},
  _inputRef,
) {
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
          <div className="mr-2 flex items-center  gap-1 rounded-full bg-white/20 p-2 duration-300">
            <div className="flex items-center text-neutral-50">
              <CommandIcon size={15} />
              <div className="select-none text-sm">K</div>
            </div>
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
});
