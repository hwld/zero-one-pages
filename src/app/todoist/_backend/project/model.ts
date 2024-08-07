import { z } from "zod";
import { ProjectRecord, projectRecordSchema } from "./repository";

export type ProjectSummary = ProjectRecord & {
  subProjects: ProjectSummary[];
};

export const projectSummarySchema: z.ZodType<ProjectSummary> =
  projectRecordSchema.merge(
    z.object({
      subProjects: z.lazy(() => projectSummarySchema.array()),
    }),
  );
