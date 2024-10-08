import { z, type BRAND } from "zod";

export type Project = {
  taskboxId: string;
  parentId: string | null;
  label: string;
  todos: number;
  order: number;
  subProjects: Project[];
};

export const projectSchema: z.ZodType<Project> = z.object({
  taskboxId: z.string(),
  parentId: z.string().nullable(),
  label: z.string(),
  todos: z.number(),
  order: z.number(),
  subProjects: z.lazy(() => projectSchema.array()),
});

type GetOrderBasedOnProjectParams = {
  baseProjectId: string;
  position: "before" | "after";
  getProject: (id: string) => Project | undefined;
};
type OrderBasedOnProject = { parentId: string | null; order: number };

export const getOrderBasedOnProject = ({
  baseProjectId,
  position,
  getProject,
}: GetOrderBasedOnProjectParams): OrderBasedOnProject => {
  const baseProject = getProject(baseProjectId);
  if (!baseProject) {
    throw new Error(`存在しないプロジェクト :${baseProject}`);
  }

  switch (position) {
    case "before": {
      return { parentId: baseProject.parentId, order: baseProject.order };
    }
    case "after": {
      const hasSubProjects = baseProject.subProjects.length !== 0;

      return hasSubProjects
        ? { parentId: baseProject.taskboxId, order: 0 }
        : { parentId: baseProject.parentId, order: baseProject.order + 1 };
    }
    default: {
      throw new Error(position satisfies never);
    }
  }
};

type CreateInput = { label: string; parentId: string | null; order?: number };
export type ValidatedCreateInput = CreateInput & BRAND<"CreateInput">;

export const validateCreateInput = (
  input: CreateInput,
): ValidatedCreateInput => {
  return input as ValidatedCreateInput;
};

type UpdateInput = { id: string; label: string };
export type ValidatedUpdateInput = UpdateInput & BRAND<"UpdateInput">;

export const validateUpdateInput = (
  input: UpdateInput,
  { getProject }: { getProject: (id: string) => Project | undefined },
): ValidatedUpdateInput => {
  const project = getProject(input.id);
  if (!project) {
    throw new Error(`プロジェクトが存在しない: ${input.id}`);
  }

  return input as ValidatedUpdateInput;
};

type UpdatePositionInput = {
  projectId: string;
  parentProjectId: string | null;
  order: number;
};
export type ValidatedUpdatePositionInput = UpdatePositionInput &
  BRAND<"UpdatePositionInput">;

export const validateUpdatePositionInputs = (
  inputs: UpdatePositionInput[],
  { getProjects }: { getProjects: (ids: string[]) => Project[] },
): ValidatedUpdatePositionInput[] => {
  const projects = getProjects(inputs.map((i) => i.projectId));
  const projectMap = new Map(projects.map((p) => [p.taskboxId, p]));

  return inputs.map((input) => {
    if (!projectMap.get(input.projectId)) {
      throw new Error(`プロジェクトが存在しない: ${input.projectId}`);
    }

    return input as ValidatedUpdatePositionInput;
  });
};
