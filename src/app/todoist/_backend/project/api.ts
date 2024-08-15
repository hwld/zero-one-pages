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

export const changeProjectsPosition = async (
  changes: ProjectPositionChange[],
): Promise<void> => {
  await fetcher.post(TodoistAPI.changeProjectPosition(), { body: changes });
  return;
};

export const deleteProject = async (id: string): Promise<void> => {
  await fetcher.delete(TodoistAPI.project(id));
  return;
};

export const projectApiHandlers = [
  http.get(TodoistAPI.projects(), async () => {
    await delay();

    const summaries = projectRepository.getAll();
    return HttpResponse.json(summaries);
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
