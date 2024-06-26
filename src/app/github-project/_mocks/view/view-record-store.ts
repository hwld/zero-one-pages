import { z } from "zod";
import { taskStatusStore } from "../task-status/store";
import { initialStatuses } from "../task-status/data";
import { taskStore } from "../task/store";
import { initialTasks } from "../task/data";

export const viewColumnRecordSchema = z.object({
  statusId: z.string(),
  order: z.coerce.number(),
});

export const viewTaskRecordSchema = z.object({
  taskId: z.string(),
  order: z.coerce.number(),
});

export const viewRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  columnRecords: z.array(viewColumnRecordSchema),
  taskRecords: z.array(viewTaskRecordSchema),
});

export type ViewColumnRecord = z.infer<typeof viewColumnRecordSchema>;
export type ViewTaskRecord = z.infer<typeof viewTaskRecordSchema>;
export type ViewRecord = z.infer<typeof viewRecordSchema>;

class ViewRecordStore {
  private viewRecords = [...new Array(3)].map((_, i): ViewRecord => {
    const columnRecords = initialStatuses.map((status, i): ViewColumnRecord => {
      return { statusId: status.id, order: i + 1 };
    });

    const taskRecords = initialTasks.map((task, i): ViewTaskRecord => {
      return { taskId: task.id, order: i + 1 };
    });

    return {
      id: `${i + 1}`,
      name: `View${i + 1}`,
      columnRecords,
      taskRecords,
    };
  });

  public getAll(): ViewRecord[] {
    return this.viewRecords;
  }

  public get(id: string): ViewRecord | undefined {
    return this.viewRecords.find((vc) => vc.id === id);
  }

  public add(name: string) {
    const allStatus = taskStatusStore.getAll();
    const allTasks = taskStore.getAll();

    const newView: ViewRecord = {
      id: crypto.randomUUID(),
      name,
      columnRecords: allStatus.map((s, i): ViewColumnRecord => {
        return { statusId: s.id, order: i + 1 };
      }),
      taskRecords: allTasks.map((t, i): ViewTaskRecord => {
        return { taskId: t.id, order: i + 1 };
      }),
    };

    this.viewRecords = [...this.viewRecords, newView];
  }

  public moveTask(input: { viewId: string; taskId: string; newOrder: number }) {
    this.viewRecords = this.viewRecords.map((viewRecord) => {
      if (viewRecord.id === input.viewId) {
        return {
          ...viewRecord,
          taskRecords: viewRecord.taskRecords.map((taskRecord) => {
            if (taskRecord.taskId === input.taskId) {
              return { ...taskRecord, order: input.newOrder };
            }
            return taskRecord;
          }),
        };
      }
      return viewRecord;
    });
  }

  public moveColumn(input: {
    viewId: string;
    statusId: string;
    newOrder: number;
  }) {
    this.viewRecords = this.viewRecords.map((viewRecord) => {
      if (viewRecord.id !== input.viewId) {
        return viewRecord;
      }

      return {
        ...viewRecord,
        columnRecords: viewRecord.columnRecords.map((columnRecord) => {
          if (columnRecord.statusId === input.statusId) {
            return { ...columnRecord, order: input.newOrder };
          }
          return columnRecord;
        }),
      };
    });
  }

  public addColumnToAllRecords(statusId: string) {
    this.viewRecords = this.viewRecords.map((config): ViewRecord => {
      const newOrder =
        config.columnRecords.length === 0
          ? 1
          : Math.max(...config.columnRecords.map((c) => c.order)) + 1;

      return {
        ...config,
        columnRecords: [...config.columnRecords, { statusId, order: newOrder }],
      };
    });
  }

  public addTaskToAllRecords(input: { taskId: string; statusId: string }) {
    this.viewRecords = this.viewRecords.map((config): ViewRecord => {
      const taskIdsWithSameStatus = taskStore
        .getByStatusId(input.statusId)
        .map((t) => t.id);

      const tasks = config.taskRecords.filter((t) =>
        taskIdsWithSameStatus.includes(t.taskId),
      );
      const newOrder =
        tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.order)) + 1;

      return {
        ...config,
        taskRecords: [
          ...config.taskRecords,
          { taskId: input.taskId, order: newOrder },
        ],
      };
    });
  }

  public removeTaskFromAllRecords(taskId: string) {
    this.viewRecords = this.viewRecords.map((config): ViewRecord => {
      return {
        ...config,
        taskRecords: config.taskRecords.filter((t) => t.taskId !== taskId),
      };
    });
  }
}

export const viewRecordStore = new ViewRecordStore();
