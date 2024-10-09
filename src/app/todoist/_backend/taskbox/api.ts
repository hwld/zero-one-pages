import { delay, http, HttpResponse } from "msw";
import { taskboxesSchema, type Taskboxes } from "./schema";
import { TodoistAPI } from "../routes";
import { fetcher } from "../../../../lib/fetcher";
import { inboxRepository } from "./inbox/repository";
import { projectRepository } from "./project/repository";

export const fetchTaskboxes = async (): Promise<Taskboxes> => {
  const res = await fetcher.get(TodoistAPI.taskboxes());
  const json = await res.json();
  const taskboxes = taskboxesSchema.parse(json);

  return taskboxes;
};

export const taskboxApiHandlers = [
  http.get(TodoistAPI.taskboxes(), async () => {
    await delay();

    const inbox = inboxRepository.get();
    const projects = projectRepository.getAll();

    const taskboxes: Taskboxes = { inbox, projects };

    return HttpResponse.json(taskboxes);
  }),
];
