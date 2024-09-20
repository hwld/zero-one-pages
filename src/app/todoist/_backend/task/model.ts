import { z } from "zod";

export type Task = {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  order: number;
  subTasks: Task[];
};

export const taskSchema: z.ZodType<Task> = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  subTasks: z.lazy(() => taskSchema.array()),
});
