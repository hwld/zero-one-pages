import { z } from "zod";
import { Task, taskSchema, taskStore } from "./store";
import { fetcher } from "@/lib/fetcher";
import { HttpResponse, delay, http } from "msw";
import { GitHubProjectAPI } from "../api-routes";

export const fetchTask = async (id: string): Promise<Task> => {
  const res = await fetcher.get(GitHubProjectAPI.task(id));
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const createTaskInputSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルの入力は必須です")
    .max(256, "256文字以内で入力してください"),
  statusId: z.string(),
});
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await fetcher.post(GitHubProjectAPI.tasks(), { body: input });
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const deleteTask = async (id: string) => {
  await fetcher.delete(GitHubProjectAPI.task(id));
};

export const updateTaskInputSchema = createTaskInputSchema.merge(
  z.object({
    comment: z.string().max(1000, "1000文字以内で入力してください"),
  }),
);

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const updateTask = async ({
  id,
  ...input
}: UpdateTaskInput & { id: string }) => {
  const res = await fetcher.put(GitHubProjectAPI.task(id), { body: input });
  const json = await res.json();
  const updated = taskSchema.parse(json);

  return updated;
};

export const taskApiHandler = [
  http.get(GitHubProjectAPI.task(), async ({ params }) => {
    await delay();
    const id = z.string().parse(params.id);
    const task = taskStore.get(id);

    return HttpResponse.json(task);
  }),

  http.post(GitHubProjectAPI.tasks(), async ({ request }) => {
    await delay();
    const input = createTaskInputSchema.parse(await request.json());
    const createdTask = taskStore.add(input);

    return HttpResponse.json(createdTask);
  }),

  http.put(GitHubProjectAPI.task(), async ({ params, request }) => {
    await delay();
    const taskId = z.string().parse(params.id);
    const input = updateTaskInputSchema.parse(await request.json());

    const updatedTask = taskStore.update({
      id: taskId,
      title: input.title,
      comment: input.comment,
      statusId: input.statusId,
    });

    return HttpResponse.json(updatedTask);
  }),

  http.delete(GitHubProjectAPI.task(), async ({ params }) => {
    await delay();
    const id = z.string().parse(params?.id);
    taskStore.remove(id);

    return HttpResponse.json({});
  }),
];
