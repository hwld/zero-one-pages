import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "タスクのタイトルを入力してください"),
  description: z
    .string()
    .max(2000, "タスクの説明は2000文字以内で入力してください"),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

export const updateTaskDoneSchema = z.object({ done: z.boolean() });

export type UpdateTaskDoneInput = z.infer<typeof updateTaskDoneSchema>;
