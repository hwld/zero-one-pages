import { z } from "zod";
import { taskStatusStore } from "../task-status/store";
import { initialStatuses } from "../task-status/data";
import { taskStore } from "../task/store";

export const viewColumnConfigSchema = z.object({
  statusId: z.string(),
  order: z.number(),
});

export const viewTaskConfigSchema = z.object({
  taskId: z.string(),
  order: z.number(),
});

export const viewConfigSchema = z.object({
  id: z.string(),
  columnConfigs: z.array(viewColumnConfigSchema),
  taskConfigs: z.array(viewTaskConfigSchema),
});

export type ViewColumnConfig = z.infer<typeof viewColumnConfigSchema>;
export type ViewTaskConfig = z.infer<typeof viewTaskConfigSchema>;
export type ViewConfig = z.infer<typeof viewConfigSchema>;

class ViewConfigStore {
  private viewConfigs: ViewConfig[] = [
    {
      id: "1",
      columnConfigs: initialStatuses.map((status, i) => {
        return { id: status.id, statusId: status.id, order: i + 1 };
      }),
      taskConfigs: [],
    },
  ];

  public getAll(): ViewConfig[] {
    return this.viewConfigs;
  }

  public get(id: string): ViewConfig | undefined {
    return this.viewConfigs.find((vc) => vc.id === id);
  }

  public add() {
    const allStatus = taskStatusStore.getAll();
    const allTasks = taskStore.getAll();

    const newView: ViewConfig = {
      id: crypto.randomUUID(),
      columnConfigs: allStatus.map((s, i): ViewColumnConfig => {
        return { statusId: s.id, order: i + 1 };
      }),
      taskConfigs: allTasks.map((t, i): ViewTaskConfig => {
        return { taskId: t.id, order: i + 1 };
      }),
    };

    this.viewConfigs = [...this.viewConfigs, newView];
  }

  public addColumnToAllConfigs(statusId: string) {
    this.viewConfigs = this.viewConfigs.map((config): ViewConfig => {
      const newOrder =
        config.columnConfigs.length === 0
          ? 1
          : Math.max(...config.columnConfigs.map((c) => c.order)) + 1;
      return {
        ...config,
        columnConfigs: [...config.columnConfigs, { statusId, order: newOrder }],
      };
    });
  }

  public addTaskToAllConfigs(taskId: string) {
    this.viewConfigs = this.viewConfigs.map((config): ViewConfig => {
      const newOrder =
        config.taskConfigs.length === 0
          ? 1
          : Math.max(...config.taskConfigs.map((t) => t.order)) + 1;
      return {
        ...config,
        taskConfigs: [...config.taskConfigs, { taskId, order: newOrder }],
      };
    });
  }

  public removeTaskFromAllConfigs(taskId: string) {
    this.viewConfigs = this.viewConfigs.map((config): ViewConfig => {
      return {
        ...config,
        taskConfigs: config.taskConfigs.filter((t) => t.taskId !== taskId),
      };
    });
  }
}

export const viewConfigStore = new ViewConfigStore();
