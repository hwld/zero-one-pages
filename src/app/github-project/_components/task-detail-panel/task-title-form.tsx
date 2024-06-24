import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../button";
import { Task } from "../../_mocks/task/store";
import { useId } from "react";
import { Input } from "../input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTaskInput, updateTaskInputSchema } from "../../_mocks/task/api";
import { useUpdateTask } from "../../_queries/use-update-task";
import {
  autoUpdate,
  offset,
  useFloating,
  useMergeRefs,
} from "@floating-ui/react";

export const TaskTitleForm: React.FC<{
  task: Task;
  onCancel: () => void;
  onAfterSubmit: () => void;
}> = ({ onCancel, onAfterSubmit, task }) => {
  const {
    register,
    formState: { errors },
    handleSubmit: buildHandleSubmit,
  } = useForm<UpdateTaskInput>({
    defaultValues: {
      title: task.title,
      statusId: task.status.id,
      description: task.description,
    },
    resolver: zodResolver(updateTaskInputSchema),
  });

  const updateTaskMutation = useUpdateTask();

  const handleSubmit = buildHandleSubmit((input) => {
    updateTaskMutation.mutate({ ...input, id: task.id });
    onAfterSubmit();
  });

  const { refs, floatingStyles } = useFloating({
    open: !!errors.title,
    placement: "top-start",
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { ref, ...otherRegister } = register("title");
  const titleInputRef = useMergeRefs([refs.setReference, ref]);

  const titleErrorId = `${useId()}-title-error`;

  return (
    <form className="flex w-full items-end gap-4" onSubmit={handleSubmit}>
      <div className="grow space-y-1">
        <Input
          ref={titleInputRef}
          autoFocus
          {...otherRegister}
          disabled={updateTaskMutation.isPending}
          aria-invalid={!!errors.title}
          aria-errormessage={titleErrorId}
        />
        <AnimatePresence>
          {!!errors.title && (
            <div ref={refs.setFloating} style={floatingStyles}>
              <motion.p
                id={titleErrorId}
                className="text-xs text-red-400"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
              >
                {errors.title.message}
              </motion.p>
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        <Button color="primary" type="submit">
          Save
        </Button>
        <Button onClick={onCancel} type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
};
