import { useForm } from "react-hook-form";
import { TaskCreateFormData, taskCreateFormSchema } from "./task-create-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskDetailViewClass } from "../task-detail-content-card";
import clsx from "clsx";
import { TaskFormErrorTooltip } from "./error-tooltip";
import { Task } from "../../_mocks/api";

type Props = {
  defaultTask: Task;
  formId: string;
  // Todo UpdateTaskInputを使う
  onUpdateTask: (data: TaskCreateFormData) => void;
};
export const TaskEditForm: React.FC<Props> = ({
  defaultTask,
  formId,
  onUpdateTask,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreateFormData>({
    defaultValues: {
      title: defaultTask.title,
      description: defaultTask.description,
    },
    resolver: zodResolver(taskCreateFormSchema),
  });

  const inputBaseClass =
    "rounded bg-transparent outline outline-1 outline-zinc-500 focus-visible:outline-1 focus-visible:outline-zinc-100";

  return (
    <form
      className={taskDetailViewClass.wrapper}
      id={formId}
      onSubmit={handleSubmit(onUpdateTask)}
    >
      <TaskFormErrorTooltip error={errors.title?.message}>
        <input
          className={clsx(taskDetailViewClass.title, inputBaseClass)}
          {...register("title")}
        />
      </TaskFormErrorTooltip>
      <TaskFormErrorTooltip
        className="h-full w-full"
        error={errors.description?.message}
        placement="bottom-start"
      >
        <textarea
          className={clsx(
            taskDetailViewClass.description,
            inputBaseClass,
            "resize-none",
          )}
          {...register("description")}
        />
      </TaskFormErrorTooltip>
    </form>
  );
};
