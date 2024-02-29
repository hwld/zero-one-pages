import { FocusEventHandler, forwardRef } from "react";
import { Task } from "../page";
import { useForm } from "react-hook-form";
import { TaskFormData, taskFormSchema } from "./task-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMergeRefs } from "@floating-ui/react";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";

export const EditableTaskTitle = forwardRef<
  HTMLInputElement,
  {
    task: Task;
    editable: boolean;
    onChangeEditable: (editable: boolean) => void;
    onChangeTitle: (title: string) => void;
  }
>(function EditableTaskTitle(
  { task, editable, onChangeEditable, onChangeTitle },
  _inputRef,
) {
  const {
    register,
    handleSubmit: createHandleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { title: task.title },
    resolver: zodResolver(taskFormSchema),
  });
  const { ref: _ref, onBlur, ...registers } = register("title");

  const ref = useMergeRefs([_inputRef, _ref]);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur(e);
    onChangeEditable(false);
  };

  const handleSubmit = createHandleSubmit((data) => {
    onChangeTitle(data.title);
    onChangeEditable(false);
  });

  return editable ? (
    <Popover.Root open={!!errors.title}>
      <Popover.Anchor asChild>
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            ref={ref}
            className="w-full"
            onBlur={handleBlur}
            {...registers}
          />
        </form>
      </Popover.Anchor>
      <AnimatePresence>
        {errors.title && (
          <Popover.Portal forceMount>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={4}
              arrowPadding={10}
              asChild
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                className="flex gap-1 rounded bg-neutral-900 p-2 text-xs text-red-300"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <AlertCircleIcon size={15} />
                {errors.title.message}
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  ) : (
    <label
      className="cursor-pointer select-none break-all checked:line-through"
      htmlFor={task.id}
    >
      {task.title}
    </label>
  );
});
