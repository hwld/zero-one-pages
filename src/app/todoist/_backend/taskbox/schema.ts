import { z } from "zod";
import { projectSchema } from "./project/model";

export const taskboxesSchema = z.object({
  inbox: z.object({ taskboxId: z.string() }),
  projects: z.array(projectSchema),
});

export type Taskboxes = z.infer<typeof taskboxesSchema>;
