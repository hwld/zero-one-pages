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

type GetOrderBasedOnProjectParams = {
  baseProject: Project;
  position: "before" | "after";
};

type OrderBasedOnProject = { parentId: string | null; order: number };

export const getOrderBasedOnProject = ({
  baseProject,
  position,
}: GetOrderBasedOnProjectParams): OrderBasedOnProject => {
  switch (position) {
    case "before": {
      return { parentId: baseProject.parentId, order: baseProject.order };
    }
    case "after": {
      const hasSubProjects = baseProject.subProjects.length !== 0;

      return hasSubProjects
        ? { parentId: baseProject.id, order: 0 }
        : { parentId: baseProject.parentId, order: baseProject.order + 1 };
    }
    default: {
      throw new Error(position satisfies never);
    }
  }
};
