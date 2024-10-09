import { initialData } from "./data";
import type { Task } from "./model";

export type TaskRecord = {
  id: string;
  done: boolean;
  parentId: string | null;
  title: string;
  description: string;
  order: number;
  taskboxId: string;
};

class TaskRepository {
  private taskRecords: TaskRecord[] = initialData;

  public get(id: string): Task | undefined {
    return recordsToTasks(this.taskRecords).find((t) => t.id === id);
  }

  public getAll(): Task[] {
    return recordsToTasks(this.taskRecords);
  }

  public getMaxOrderByParentId(parentId: string | null) {
    const siblingsOrders = this.taskRecords
      .filter((t) => t.parentId === parentId)
      .map((t) => t.order);

    return siblingsOrders.length > 0 ? Math.max(...siblingsOrders) : 0;
  }

  public add(input: {
    title: string;
    description: string;
    order?: number;
    parentId: string | null;
    taskboxId: string;
  }) {
    const newOrder =
      input.order ?? this.getMaxOrderByParentId(input.parentId) + 1;

    const newRecord: TaskRecord = {
      id: crypto.randomUUID(),
      done: false,
      parentId: input.parentId,
      title: input.title,
      description: input.description,
      taskboxId: input.taskboxId,
      order: newOrder,
    };

    this.taskRecords = this.taskRecords.map((t) => {
      if (t.parentId === input.parentId && t.order >= newOrder) {
        return { ...t, order: t.order + 1 };
      }
      return t;
    });

    this.taskRecords = [...this.taskRecords, newRecord];
  }

  public update(input: { id: string; title: string; description: string }) {
    this.taskRecords = this.taskRecords.map((r) => {
      if (r.id === input.id) {
        return { ...r, title: input.title, description: input.description };
      }
      return r;
    });
  }

  public updateTaskDone(input: { id: string; done: boolean }) {
    const task = this.get(input.id);
    if (!task) {
      throw new Error("タスクが存在しません");
    }

    if (input.done) {
      const allDescendantIds = allDescendantTaskIds(this.taskRecords, input.id);
      this.taskRecords = this.taskRecords.map((t) => {
        if (t.id === task.id || allDescendantIds.includes(t.id)) {
          return { ...t, done: true };
        }
        return t;
      });
    } else {
      this.taskRecords = this.taskRecords.map((t) => {
        if (t.id === task.id) {
          return { ...t, done: false };
        }
        return t;
      });
    }
  }

  public delete(id: string) {
    this.taskRecords = this.taskRecords.filter((r) => r.id !== id);
  }
}

export const taskRepository = new TaskRepository();

const recordsToTasks = (taskRecords: TaskRecord[]): Task[] => {
  // このMapの要素のsubTasksをmutableに書き換えていく
  const taskMap = new Map<string, Task>(
    taskRecords.map((r) => [
      r.id,
      {
        id: r.id,
        done: r.done,
        title: r.title,
        description: r.description,
        order: r.order,
        parentId: r.parentId,
        subTasks: [],
        taskboxId: r.taskboxId,
      } satisfies Task,
    ]),
  );

  const tasks = Array.from(taskMap.values());

  tasks.forEach((task) => {
    if (!task.parentId) {
      return;
    }

    const parent = taskMap.get(task.parentId);
    if (!parent) {
      throw new Error(
        `親タスクが存在しない id:${task.id}, parentId:${task.parentId}`,
      );
    }

    parent.subTasks.push(task);
    parent.subTasks.sort((a, b) => a.order - b.order);
  });

  const result = tasks
    .filter((t) => !t.parentId)
    .sort((a, b) => a.order - b.order);

  return result;
};

const allDescendantTaskIds = (
  taskRecords: TaskRecord[],
  taskId: string,
): string[] => {
  const allTasks = recordsToTasks(taskRecords);
  const task = allTasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error("タスクが存在しない");
  }

  const descendants: Task[] = [];
  const pushDescendantIds = (task: Task) => {
    descendants.push(...task.subTasks);
    task.subTasks.forEach((sub) => {
      pushDescendantIds(sub);
    });
  };

  pushDescendantIds(task);

  return descendants.map((d) => d.id);
};
