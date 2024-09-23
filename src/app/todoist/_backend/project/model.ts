import { z } from "zod";

export type Project = {
  id: string;
  parentId: string | null;
  label: string;
  todos: number;
  order: number;
  subProjects: Project[];
};

export const projectSchema: z.ZodType<Project> = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  label: z.string(),
  todos: z.number(),
  order: z.number(),
  subProjects: z.lazy(() => projectSchema.array()),
});
