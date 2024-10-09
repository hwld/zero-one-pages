import { z } from "zod";
import { taskSchema } from "../../task/model";

export type Inbox = {
  taskboxId: string;
};

export const inboxDetailSchema = z.object({
  taskboxId: z.string(),
  tasks: z.array(taskSchema),
});

export type InboxDetail = z.infer<typeof inboxDetailSchema>;
