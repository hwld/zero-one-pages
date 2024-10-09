import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000),
  taskboxId: z.string().min(1),
});

export const taskFormFieldMap: Record<string, string> = {
  title: "タスク名",
  description: "タスクの説明",
  taskboxId: "プロジェクトID",
} satisfies Record<keyof TaskFormData, string>;

export type TaskFormData = z.infer<typeof taskFormSchema>;

export const updateTaskDoneSchema = z.object({ done: z.boolean() });

export type UpdateTaskDoneInput = z.infer<typeof updateTaskDoneSchema>;
