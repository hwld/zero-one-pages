import { delay, http, HttpResponse } from "msw";
import { taskFormSchema, type TaskFormData } from "./schema";
import { TodoistAPI } from "../routes";
import { fetcher } from "../../../../lib/fetcher";
import { taskRepository } from "./repository";
import { z } from "zod";
import { taskSchema } from "./model";

export const fetchTasks = async () => {
  const res = await fetcher.get(TodoistAPI.tasks());
  const json = await res.json();
  const tasks = z.array(taskSchema).parse(json);

  return tasks;
};

export const createTask = async (input: TaskFormData) => {
  await fetcher.post(TodoistAPI.tasks(), { body: input });
};

export const taskApiHandlers = [
  http.get(TodoistAPI.tasks(), async () => {
    await delay();
    const tasks = taskRepository.getAll();

    return HttpResponse.json(tasks);
  }),

  http.post(TodoistAPI.tasks(), async ({ request }) => {
    await delay();
    const input = taskFormSchema.parse(await request.json());

    taskRepository.add({
      title: input.title,
      description: input.description,
      parentId: null,
    });

    return HttpResponse.json({});
  }),
];
