import { z } from "zod";
import { projectSchema } from "./project/model";
import { inboxSchema } from "./inbox/model";

export const taskboxesSchema = z.object({
  inbox: inboxSchema,
  projects: z.array(projectSchema),
});

export type Taskboxes = z.infer<typeof taskboxesSchema>;
