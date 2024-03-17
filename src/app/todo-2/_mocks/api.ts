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

const allTasks: Task[] = initialTasks;

const paginatedTasksInputSchema = z.object({
  sortEntry: sortEntrySchema,
  paginationEntry: paginationEntrySchema,
  fieldFilters: z.array(fieldFilterSchema),
  selectionFilter: selectionFilterSchema,
  searchText: z.string(),
  selectedTaskIds: z.array(z.string()),
});
type PaginatedTasksInput = z.infer<typeof paginatedTasksInputSchema>;

const paginatedTasksEntrySchema = z.object({
  tasks: z.array(taskSchema),
  totalPages: z.number(),
});
type PaginatedTasksEntry = z.infer<typeof paginatedTasksEntrySchema>;

export const Todo2API = {
  base: "/todo-2/api",
  tasks: (input?: PaginatedTasksInput) =>
    `${Todo2API.base}/tasks${
      input ? `?input=${encodeURIComponent(JSON.stringify(input))}` : ""
    }`,
  task: (id?: string) => `${Todo2API.base}/tasks/${id ?? ":id"}`,
};

export const fetchPaginatedTasks = async (
  input: PaginatedTasksInput,
): Promise<PaginatedTasksEntry> => {
  const res = await fetch(Todo2API.tasks(input));
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

export const handlers = [
  http.get(Todo2API.tasks(), ({ request }) => {
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
      if (fieldFilters.length === 0) {
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
];
