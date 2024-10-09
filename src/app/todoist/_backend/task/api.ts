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
import { taskSchema, type Task } from "./model";

export const fetchTask = async (id: string): Promise<Task> => {
  const res = await fetcher.get(TodoistAPI.task(id));
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetcher.get(TodoistAPI.tasks());
  const json = await res.json();
  const tasks = z.array(taskSchema).parse(json);

  return tasks;
};

export const createTask = async (input: TaskFormData): Promise<void> => {
  await fetcher.post(TodoistAPI.tasks(), { body: input });
};

export const updateTask = async ({
  id,
  ...input
}: TaskFormData & { id: string }): Promise<void> => {
  await fetcher.patch(TodoistAPI.task(id), { body: input });
};

export const updateTaskDone = async ({
  id,
  ...body
}: UpdateTaskDoneInput & { id: string }): Promise<void> => {
  await fetcher.patch(TodoistAPI.updateTaskDone(id), { body });
};

export const deleteTask = async (id: string): Promise<void> => {
  await fetcher.delete(TodoistAPI.task(id));
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
      taskboxId: "TODO:",
    });

    return HttpResponse.json({});
  }),

  http.get(TodoistAPI.task(), async ({ params }) => {
    await delay();
    const taskId = z.string().parse(params.id);

    const task = taskRepository.get(taskId);
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(task);
  }),

  http.patch(TodoistAPI.task(), async ({ request, params }) => {
    await delay();
    const taskId = z.string().parse(params.id);
    const input = taskFormSchema.parse(await request.json());

    taskRepository.update({
      id: taskId,
      title: input.title,
      description: input.description,
    });

    return HttpResponse.json({});
  }),

  http.patch(TodoistAPI.updateTaskDone(), async ({ params, request }) => {
    await delay();
    const taskId = z.string().parse(params.id);
    const input = updateTaskDoneSchema.parse(await request.json());

    taskRepository.updateTaskDone({ id: taskId, done: input.done });

    return HttpResponse.json({});
  }),

  http.delete(TodoistAPI.task(), async ({ params }) => {
    await delay();
    const taskId = z.string().parse(params.id);

    taskRepository.delete(taskId);

    return HttpResponse.json({});
  }),
];
