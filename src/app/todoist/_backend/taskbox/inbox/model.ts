import { z } from "zod";
import { taskSchema } from "../../task/model";

export const inboxSchema = z.object({
  taskboxId: z.string(),
  taskCount: z.number(),
});

export type Inbox = z.infer<typeof inboxSchema>;

export const inboxDetailSchema = z.object({
  taskboxId: z.string(),
  taskCount: z.number(),
  tasks: z.array(taskSchema),
});

export type InboxDetail = z.infer<typeof inboxDetailSchema>;
