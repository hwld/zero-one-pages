import { z } from "zod";
import { projectRepository } from "./repository";
import { TodoistAPI } from "../../routes";
import { delay, http, HttpResponse } from "msw";
import {
  getOrderBasedOnProject,
  Project,
  projectSchema,
  validateCreateInput,
  validateDeleteInput,
  validateUpdateInput,
  validateUpdatePositionInputs,
} from "./model";
import { fetcher } from "../../../../../lib/fetcher";
import {
  CreateProjectInput,
  createProjectInputSchema,
  ProjectPositionChange,
  projectPositionChangeSchema,
  UpdateProjectInput,
  updateProjectInputSchema,
} from "./schema";

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetcher.get(TodoistAPI.projects());
  const json = await res.json();
  const projectSummaries = z.array(projectSchema).parse(json);

  return projectSummaries;
};

export const createProject = async (
  input: CreateProjectInput,
): Promise<void> => {
  await fetcher.post(TodoistAPI.projects(), { body: input });
};

export const updateProject = async ({
  id,
  ...body
}: UpdateProjectInput & { id: string }): Promise<void> => {
  await fetcher.patch(TodoistAPI.project(id), { body });
};

export const changeProjectsPosition = async (
  changes: ProjectPositionChange[],
): Promise<void> => {
  await fetcher.post(TodoistAPI.changeProjectPosition(), { body: changes });
};

export const deleteProject = async (id: string): Promise<void> => {
  await fetcher.delete(TodoistAPI.project(id));
};

export const projectApiHandlers = [
  http.get(TodoistAPI.projects(), async () => {
    await delay();

    const summaries = projectRepository.getAll();
    return HttpResponse.json(summaries);
  }),

  http.post(TodoistAPI.projects(), async ({ request }) => {
    await delay();
    const input = createProjectInputSchema.parse(await request.json());

    if (input.type === "default") {
      const validatedInput = validateCreateInput({
        label: input.label,
        parentId: null,
      });

      projectRepository.add(validatedInput);
    } else {
      const order = getOrderBasedOnProject({
        baseProjectId: input.referenceProjectId,
        position: input.type,
        getProject: projectRepository.get,
      });

      const validatedInput = validateCreateInput({
        label: input.label,
        parentId: order.parentId,
        order: order.order,
      });

      projectRepository.add(validatedInput);
    }

    return HttpResponse.json({});
  }),

  http.patch(TodoistAPI.project(), async ({ params, request }) => {
    await delay();
    const id = z.string().parse(params.id);
    const input = updateProjectInputSchema.parse(await request.json());

    const validatedInput = validateUpdateInput(
      { id, label: input.label },
      { getProject: projectRepository.get },
    );
    projectRepository.update(validatedInput);

    return HttpResponse.json({});
  }),

  http.post(TodoistAPI.changeProjectPosition(), async ({ request }) => {
    await delay();

    const changes = z
      .array(projectPositionChangeSchema)
      .parse(await request.json());

    const validatedChanges = validateUpdatePositionInputs(changes, {
      getProjects: projectRepository.getMany,
    });

    validatedChanges.forEach((change) => {
      projectRepository.updatePosition(change);
    });

    return HttpResponse.json({});
  }),

  http.delete(TodoistAPI.project(), async ({ params }) => {
    await delay();

    const id = z.string().parse(params.id);

    const validatedInput = validateDeleteInput(
      { projectId: id },
      { getProject: projectRepository.get },
    );

    projectRepository.remove(validatedInput);

    return HttpResponse.json({});
  }),
];
