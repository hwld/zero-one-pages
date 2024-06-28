import { z } from "zod";
import { initialStatuses } from "./data";

export const taskStatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.union([
    z.literal("green"),
    z.literal("orange"),
    z.literal("red"),
    z.literal("purple"),
    z.literal("gray"),
    z.literal("transparent"),
  ]),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;

class TaskStatusStore {
  private status: TaskStatus[] = initialStatuses;

  public getAll(): TaskStatus[] {
    return this.status;
  }

  public get(id: string): TaskStatus | undefined {
    return this.status.find((s) => s.id === id);
  }
}

export const taskStatusStore = new TaskStatusStore();
