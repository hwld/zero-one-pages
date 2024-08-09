import { z } from "zod";
import { projectRepository } from "./repository";
import { fetcher } from "@/lib/fetcher";
import { TodoistAPI } from "../routes";
import { delay, http, HttpResponse } from "msw";
import {
  Project,
  ProjectPositionChange,
  projectPositionChangeSchema,
  projectSchema,
} from "./model";

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

export const projectApiHandlers = [
  http.get(TodoistAPI.projects(), async () => {
    await delay();

    const summaries = projectRepository.getAll();
    return HttpResponse.json(summaries);
  }),

  http.post(TodoistAPI.changeProjectPosition(), async ({ request }) => {
    const changes = z
      .array(projectPositionChangeSchema)
      .parse(await request.json());

    changes.forEach((change) => {
      projectRepository.updatePosition(change);
    });

    return HttpResponse.json({});
  }),
];
