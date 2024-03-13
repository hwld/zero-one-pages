import { useForm } from "react-hook-form";
import { Task } from "../../_contexts/tasks-provider";
import { TaskFormData, taskFormSchema } from "./task-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskDetailViewClass } from "../task-detail-content-card";
import clsx from "clsx";

type Props = {
  defaultTask: Task;
  formId: string;
  onUpdateTask: (data: TaskFormData) => void;
};
export const TaskEditForm: React.FC<Props> = ({
  defaultTask,
  formId,
  onUpdateTask,
}) => {
  const { register, handleSubmit } = useForm<TaskFormData>({
    defaultValues: {
      title: defaultTask.title,
      description: defaultTask.description,
    },
    resolver: zodResolver(taskFormSchema),
  });

  const add = (data: TaskFormData) => {
    onUpdateTask(data);
  };

  return (
    <form
      className={taskDetailViewClass.wrapper}
      id={formId}
      onSubmit={handleSubmit(add)}
    >
      <input
        className={clsx(
          taskDetailViewClass.title,
          "rounded border border-zinc-500 bg-transparent focus-visible:border-zinc-100 focus-visible:outline-none",
        )}
        {...register("title")}
      />
      <textarea
        className={clsx(
          taskDetailViewClass.description,
          "resize-none rounded border border-zinc-500 bg-transparent focus-visible:border-zinc-100 focus-visible:outline-none",
        )}
        {...register("description")}
      />
    </form>
  );
};
