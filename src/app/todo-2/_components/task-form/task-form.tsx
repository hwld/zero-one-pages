import { z } from "zod";
import { TasksAction } from "../../_contexts/tasks-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMergeRefs } from "@floating-ui/react";
import { useEffect, useRef } from "react";
import { TaskFormErrorTooltip } from "./error-tooltip";
import clsx from "clsx";

export type TaskFormData = Parameters<TasksAction["addTask"]>[0];

const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルの入力は必須です。")
    .max(100, "タスクは100文字以下で入力してください。"),
  description: z.string().max(500, "説明は500文字以下で入力してください。"),
}) satisfies z.ZodType<TaskFormData>;

type Props = {
  onAddTask: (data: TaskFormData) => void;
  id: string;
};

export const TaskForm: React.FC<Props> = ({ onAddTask, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { title: "", description: "" },
    resolver: zodResolver(taskFormSchema),
  });

  const innerTitleRef = useRef<HTMLInputElement>(null);
  const { ref: _titleRef, ...titleRegister } = register("title");
  const titleRef = useMergeRefs([innerTitleRef, _titleRef]);

  useEffect(() => {
    innerTitleRef.current?.focus();
  }, []);

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onAddTask)}
      className="flex flex-col gap-2 px-4"
    >
      <TaskFormErrorTooltip error={errors.title?.message}>
        <input
          ref={titleRef}
          placeholder="タスクのタイトル"
          className={clsx(
            "w-full rounded bg-transparent text-lg font-bold placeholder:text-zinc-500 focus-visible:outline-none",
            errors.title && "text-red-400",
          )}
          {...titleRegister}
        />
      </TaskFormErrorTooltip>
      <TaskFormErrorTooltip error={errors.description?.message} side="bottom">
        <textarea
          placeholder="タスクの説明"
          rows={6}
          className={clsx(
            "w-full resize-none bg-transparent text-sm placeholder:text-zinc-500 focus-visible:outline-none",
            errors.description && "text-red-400",
          )}
          {...register("description")}
        />
      </TaskFormErrorTooltip>
    </form>
  );
};
