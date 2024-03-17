import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMergeRefs } from "@floating-ui/react";
import { useEffect, useRef } from "react";
import { TaskFormErrorTooltip } from "./error-tooltip";
import clsx from "clsx";
import { CreateTaskInput } from "../../_mocks/api";

export type TaskCreateFormData = CreateTaskInput;

export const taskCreateFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルの入力は必須です。")
    .max(100, "タスクは100文字以下で入力してください。"),
  description: z.string().max(10000, "説明は10000文字以下で入力してください。"),
}) satisfies z.ZodType<TaskCreateFormData>;

type Props = {
  onAddTask: (data: TaskCreateFormData) => void;
  id: string;
};

export const TaskCreateForm: React.FC<Props> = ({ onAddTask, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreateFormData>({
    defaultValues: { title: "", description: "" },
    resolver: zodResolver(taskCreateFormSchema),
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
      <TaskFormErrorTooltip
        error={errors.description?.message}
        placement="bottom-start"
      >
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
