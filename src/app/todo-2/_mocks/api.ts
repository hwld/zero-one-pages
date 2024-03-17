"use client";
import { HttpResponse, http } from "msw";
import { initialTasks } from "../_lib/initial-data";
import { paginate } from "../_lib/utils";
import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.union([z.literal("done"), z.literal("todo")]),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
});
export type Task = z.infer<typeof taskSchema>;

export const sortOrderSchema = z.union([z.literal("asc"), z.literal("desc")]);
export type SortOrder = z.infer<typeof sortOrderSchema>;

export const sortEntrySchema = z.object({
  field: z.union([
    z.literal("title"),
    z.literal("createdAt"),
    z.literal("completedAt"),
  ]),
  order: sortOrderSchema,
});
export type SortEntry = z.infer<typeof sortEntrySchema>;

export const paginationEntrySchema = z.object({
  page: z.number(),
  limit: z.number(),
});
export type PaginationEntry = z.infer<typeof paginationEntrySchema>;

export const fieldFilterSchema = z.union([
  z.object({
    id: z.string(),
    type: z.literal("field"),
    field: z.literal("status"),
    value: z.literal("todo"),
  }),
  z.object({
    id: z.string(),
    type: z.literal("field"),
    field: z.literal("status"),
    value: z.literal("done"),
  }),
]);
export type FieldFilter = z.infer<typeof fieldFilterSchema>;

export const selectionFilterSchema = z
  .union([z.literal("selected"), z.literal("unselected")])
  .nullable();
export type SelectionFilter = z.infer<typeof selectionFilterSchema>;

let allTasks: Task[] = initialTasks;

const paginatedTasksInputSchema = z.object({
  sortEntry: sortEntrySchema,
  paginationEntry: paginationEntrySchema,
  fieldFilters: z.array(fieldFilterSchema),
  selectionFilter: selectionFilterSchema,
  searchText: z.string(),
  selectedTaskIds: z.array(z.string()),
});
export type PaginatedTasksInput = z.infer<typeof paginatedTasksInputSchema>;

const paginatedTasksEntrySchema = z.object({
  tasks: z.array(taskSchema),
  totalPages: z.number(),
});
type PaginatedTasksEntry = z.infer<typeof paginatedTasksEntrySchema>;

const createTaskInputSchema = taskSchema.pick({
  title: true,
  description: true,
});
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

const updateTaskInputSchema = taskSchema.pick({
  id: true,
  title: true,
  description: true,
  status: true,
});
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

const updateTaskStatusesInputSchema = z
  .object({
    selectedTaskIds: z.array(z.string()),
  })
  .merge(taskSchema.pick({ status: true }));
export type UpdateTaskStatusesInput = z.infer<
  typeof updateTaskStatusesInputSchema
>;

export const Todo2API = {
  base: "/todo-2/api",
  getTasks: (input?: PaginatedTasksInput) =>
    `${Todo2API.base}/tasks${
      input ? `?input=${encodeURIComponent(JSON.stringify(input))}` : ""
    }`,
  task: (id?: string) => `${Todo2API.base}/tasks/${id ?? ":id"}`,
  createTask: () => `${Todo2API.base}/tasks`,
  updateTaskStatuses: () => `${Todo2API.base}/update-task-statuses`,
  deleteTasks: () => `${Todo2API.base}/delete-tasks`,
};

export const fetchPaginatedTasks = async (
  input: PaginatedTasksInput,
): Promise<PaginatedTasksEntry> => {
  const res = await fetch(Todo2API.getTasks(input));
  const json = await res.json();
  const tasks = paginatedTasksEntrySchema.parse(json);

  return tasks;
};

export const fetchTask = async (id: string): Promise<Task | undefined> => {
  const res = await fetch(Todo2API.task(id));
  const json = await res.json();
  const task = taskSchema.optional().parse(json);

  return task;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await fetch(Todo2API.createTask(), {
    method: "POST",
    body: JSON.stringify(input),
  });
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const updateTask = async (input: UpdateTaskInput): Promise<Task> => {
  const res = await fetch(Todo2API.task(), {
    method: "PUT",
    body: JSON.stringify(input),
  });
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const updateTaskStatuses = async (
  input: UpdateTaskStatusesInput,
): Promise<void> => {
  await fetch(Todo2API.updateTaskStatuses(), {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return;
};

export const deleteTasks = async (ids: string[]): Promise<void> => {
  await fetch(Todo2API.deleteTasks(), {
    method: "DELETE",
    body: JSON.stringify(ids),
  });

  return;
};

export const todo2Handlers = [
  http.get(Todo2API.getTasks(), ({ request }) => {
    const searchParam = new URL(request.url).searchParams;
    const input = JSON.parse(searchParam.get("input") ?? "{}");

    const {
      sortEntry,
      paginationEntry,
      fieldFilters,
      selectionFilter,
      searchText,
      selectedTaskIds,
    } = paginatedTasksInputSchema.parse(input);

    const { field, order } = sortEntry;

    const filteredTasks = allTasks.filter((task) => {
      if (fieldFilters.length === 0 && selectionFilter === null) {
        return true;
      }

      const statusFilters = fieldFilters.filter((f) => f.field === "status");
      const isMatchingStatusFilter =
        statusFilters.length > 0
          ? statusFilters.some((f) => task[f.field] === f.value)
          : true;

      const isMatchingSelectionFilter = (() => {
        switch (selectionFilter) {
          case "selected": {
            return selectedTaskIds.includes(task.id);
          }
          case "unselected": {
            return !selectedTaskIds.includes(task.id);
          }
          case null: {
            return true;
          }
          default: {
            throw new Error(selectionFilter satisfies never);
          }
        }
      })();

      return isMatchingStatusFilter && isMatchingSelectionFilter;
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
      switch (field) {
        case "title": {
          return a.title.localeCompare(b.title) * (order === "desc" ? -1 : 1);
        }
        case "createdAt":
        case "completedAt": {
          return (
            ((a[field]?.getTime() ?? Number.MAX_VALUE) -
              (b[field]?.getTime() ?? Number.MAX_VALUE)) *
            (order === "desc" ? -1 : 1)
          );
        }
        default: {
          throw new Error(field satisfies never);
        }
      }
    });

    const searchedTasks = sortedTasks.filter((task) => {
      return (
        task.title.includes(searchText) || task.description.includes(searchText)
      );
    });

    const { page, limit } = paginationEntry;
    const paginatedTasks = paginate(searchedTasks, { page, limit });

    return HttpResponse.json({
      tasks: paginatedTasks,
      totalPages: Math.ceil(searchedTasks.length / limit),
    } satisfies PaginatedTasksEntry);
  }),
  http.get(Todo2API.task(), ({ params }) => {
    const id = z.string().parse(params.id);
    const task = allTasks.find((t) => t.id === id);
    return HttpResponse.json(task);
  }),
  http.post(Todo2API.createTask(), async ({ request }) => {
    const input = createTaskInputSchema.parse(await request.json());

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: "todo",
      createdAt: new Date(),
      completedAt: undefined,
    };
    allTasks = [...allTasks, newTask];

    return HttpResponse.json(newTask);
  }),
  http.put(Todo2API.task(), async ({ request }) => {
    const input = updateTaskInputSchema.parse(await request.json());

    allTasks = allTasks.map((t) => {
      if (t.id === input.id) {
        return {
          ...t,
          title: input.title,
          description: input.description,
          status: input.status,
          completedAt: input.status === "done" ? new Date() : undefined,
        };
      }

      return t;
    });

    const updatedTask = allTasks.find((t) => t.id === input.id);

    return HttpResponse.json(updatedTask);
  }),
  http.patch(Todo2API.updateTaskStatuses(), async ({ request }) => {
    const input = updateTaskStatusesInputSchema.parse(await request.json());

    allTasks = allTasks.map((t) => {
      if (t.status !== input.status && input.selectedTaskIds.includes(t.id)) {
        return {
          ...t,
          status: input.status,
          completedAt: input.status === "done" ? new Date() : undefined,
        };
      }
      return t;
    });

    return HttpResponse.json({});
  }),
  http.delete(Todo2API.deleteTasks(), async ({ request }) => {
    const ids = z.array(z.string()).parse(await request.json());

    allTasks = allTasks.filter((t) => {
      return !ids.includes(t.id);
    });

    return HttpResponse.json({});
  }),
];
