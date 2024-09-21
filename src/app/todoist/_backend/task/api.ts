import { delay, http, HttpResponse } from "msw";
import {
  taskFormSchema,
  updateTaskDoneSchema,
  type TaskFormData,
  type UpdateTaskDoneInput,
} from "./schema";
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

export const updateTaskDone = async ({
  id,
  ...body
}: UpdateTaskDoneInput & { id: string }) => {
  await fetcher.patch(TodoistAPI.updateTaskDone(id), { body });
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

  http.patch(TodoistAPI.updateTaskDone(), async ({ params, request }) => {
    const taskId = z.string().parse(params.id);
    const input = updateTaskDoneSchema.parse(await request.json());

    taskRepository.updateTaskDone({ id: taskId, done: input.done });

    return HttpResponse.json({});
  }),
];
