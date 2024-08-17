import { z } from "zod";
import { projectRepository } from "./repository";
import { TodoistAPI } from "../routes";
import { delay, http, HttpResponse } from "msw";
import {
  Project,
  ProjectPositionChange,
  projectPositionChangeSchema,
  projectSchema,
} from "./model";
import { fetcher } from "../../../../lib/fetcher";

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetcher.get(TodoistAPI.projects());
  const json = await res.json();
  const projectSummaries = z.array(projectSchema).parse(json);

  return projectSummaries;
};

// TODO: parentIdとかorderを指定できるようにする
export const projectFormSchema = z.object({
  label: z
    .string()
    .min(1, "プロジェクト名を入力してください")
    .max(120, "プロジェクト名は120文字以内で入力してください"),
});
export type ProjectFormData = z.infer<typeof projectFormSchema>;

export const createProject = async (data: ProjectFormData): Promise<void> => {
  await fetcher.post(TodoistAPI.projects(), { body: data });
};

export const updateProject = async ({
  id,
  ...data
}: ProjectFormData & { id: string }): Promise<void> => {
  await fetcher.patch(TodoistAPI.project(id), { body: data });
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
    const input = projectFormSchema.parse(await request.json());

    projectRepository.add({
      parentId: null,
      label: input.label,
      order: projectRepository.getSiblingsMaxOrder(null) + 1,
    });

    return HttpResponse.json({});
  }),

  http.patch(TodoistAPI.project(), async ({ params, request }) => {
    const id = z.string().parse(params.id);
    const input = projectFormSchema.parse(await request.json());

    projectRepository.update({ id, label: input.label });

    return HttpResponse.json({});
  }),

  http.post(TodoistAPI.changeProjectPosition(), async ({ request }) => {
    await delay();

    const changes = z
      .array(projectPositionChangeSchema)
      .parse(await request.json());

    changes.forEach((change) => {
      projectRepository.updatePosition(change);
    });

    return HttpResponse.json({});
  }),

  http.delete(TodoistAPI.project(), async ({ params }) => {
    await delay();

    const id = z.string().parse(params.id);
    projectRepository.remove(id);

    return HttpResponse.json({});
  }),
];
