import { z } from "zod";
import { TasksAction } from "../_contexts/tasks-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMergeRefs } from "@floating-ui/react";
import { useEffect, useRef } from "react";

export type TaskFormData = Parameters<TasksAction["addTask"]>[0];

const taskFormSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
}) satisfies z.ZodType<TaskFormData>;

type Props = { onAddTask: (data: TaskFormData) => void; id: string };

export const TaskForm: React.FC<Props> = ({ onAddTask, id }) => {
  const { register, handleSubmit } = useForm<TaskFormData>({
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
      <input
        ref={titleRef}
        placeholder="タスクのタイトル"
        className="bg-transparent text-lg font-bold placeholder:text-zinc-500 focus-visible:outline-none"
        {...titleRegister}
      />
      <textarea
        placeholder="タスクの説明"
        rows={6}
        className="resize-none bg-transparent text-sm placeholder:text-zinc-500 focus-visible:outline-none"
        {...register("description")}
      />
    </form>
  );
};
