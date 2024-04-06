import { z } from "zod";
import {
  viewColumnConfigSchema,
  viewConfigSchema,
  viewConfigStore,
  viewTaskConfigSchema,
} from "./view-config-store";
import { taskSchema, taskStore } from "../task/store";
import { taskStatusSchema, taskStatusStore } from "../task-status/store";
import { fetcher } from "@/lib/fetcher";
import { HttpResponse, delay, http } from "msw";
import { GitHubProjectAPI } from "../api-routes";

const viewTaskSchema = viewTaskConfigSchema.merge(taskSchema);
const viewColumnSchema = viewColumnConfigSchema.merge(
  z.object({ tasks: z.array(viewTaskSchema), status: taskStatusSchema }),
);
const viewSummarySchema = viewConfigSchema.pick({ id: true, name: true });
const viewSchema = viewSummarySchema.merge(
  z.object({
    columns: z.array(viewColumnSchema),
  }),
);

export type View = z.infer<typeof viewSchema>;
export type ViewSummary = Pick<View, "id" | "name">;
export type ViewColumn = z.infer<typeof viewColumnSchema>;
export type ViewTask = z.infer<typeof viewTaskSchema>;

export const fetchView = async (id: string): Promise<View> => {
  const res = await fetcher.get(GitHubProjectAPI.view(id));
  const json = await res.json();
  const view = viewSchema.parse(json);

  return view;
};

export const fetchViewSummaries = async (): Promise<ViewSummary[]> => {
  const res = await fetcher.get(GitHubProjectAPI.views());
  const json = await res.json();
  const viewSummaries = z.array(viewSummarySchema).parse(json);

  return viewSummaries;
};

export const moveTaskInputSchema = z.object({
  taskId: z.string(),
  statusId: z.string(),
  newOrder: z.coerce.number(),
});
export type MoveTaskInput = z.infer<typeof moveTaskInputSchema>;

export const moveTask = async ({
  viewId,
  ...body
}: MoveTaskInput & { viewId: string }): Promise<undefined> => {
  await fetcher.post(GitHubProjectAPI.moveTask(viewId), { body });
};

export const moveColumnInputSchema = z.object({
  statusId: z.string(),
  newOrder: z.coerce.number(),
});
export type MoveColumnInput = z.infer<typeof moveColumnInputSchema>;

export const moveColumn = async ({
  viewId,
  ...body
}: MoveColumnInput & {
  viewId: string;
}) => {
  await fetcher.post(GitHubProjectAPI.moveColumn(viewId), { body });
};

export const viewApiHandler = [
  http.get(GitHubProjectAPI.views(), async () => {
    await delay();

    const summaries: ViewSummary[] = viewConfigStore
      .getAll()
      .map((config): ViewSummary => {
        return { id: config.id, name: config.name };
      });

    return HttpResponse.json(summaries);
  }),

  http.get(GitHubProjectAPI.view(), async ({ params }) => {
    await delay();
    const viewId = z.string().parse(params.id);

    const viewConfig = viewConfigStore.get(viewId);
    if (!viewConfig) {
      throw new HttpResponse(null, { status: 404 });
    }

    const allStatus = taskStatusStore.getAll();
    const allTasks = taskStore.getAll();

    const columns = viewConfig.columnConfigs.map((column): ViewColumn => {
      const status = allStatus.find((s) => s.id === column.statusId);
      if (!status) {
        throw new HttpResponse(null, { status: 404 });
      }

      const tasks: ViewTask[] = viewConfig.taskConfigs
        .map((taskConfig): ViewTask | null => {
          const task = allTasks.find(
            (t) => t.id === taskConfig.taskId && t.status.id === status.id,
          );
          if (!task) {
            return null;
          }
          return { ...taskConfig, ...task };
        })
        .filter((task): task is ViewTask => Boolean(task));
      const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

      return {
        ...column,
        status,
        tasks: sortedTasks,
      };
    });
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

    const view: View = {
      id: viewConfig.id,
      name: viewConfig.name,
      columns: sortedColumns,
    };

    return HttpResponse.json(view);
  }),

  http.post(GitHubProjectAPI.moveTask(), async ({ params, request }) => {
    await delay();

    const viewId = z.string().parse(params.id);
    const input = moveTaskInputSchema.parse(await request.json());

    const task = taskStore.get(input.taskId);
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }

    if (task.status.id !== input.statusId) {
      taskStore.update({ ...task, statusId: input.statusId });
    }

    viewConfigStore.moveTask({
      viewId,
      taskId: input.taskId,
      newOrder: input.newOrder,
    });

    return HttpResponse.json({});
  }),

  http.post(GitHubProjectAPI.moveColumn(), async ({ params, request }) => {
    await delay();

    const viewId = z.string().parse(params.id);
    const input = moveColumnInputSchema.parse(await request.json());

    viewConfigStore.moveColumn({
      viewId,
      statusId: input.statusId,
      newOrder: input.newOrder,
    });

    return HttpResponse.json({});
  }),
];
