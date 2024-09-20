import type { Task } from "./model";

export type TaskRecord = {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  order: number;
};

class TaskRepository {
  private taskRecords: TaskRecord[] = [];

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
  }) {
    const newOrder =
      input.order ?? this.getMaxOrderByParentId(input.parentId) + 1;

    const newRecord: TaskRecord = {
      id: crypto.randomUUID(),
      parentId: input.parentId,
      title: input.title,
      description: input.description,
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
}

export const taskRepository = new TaskRepository();

const recordsToTasks = (taskRecords: TaskRecord[]): Task[] => {
  // このMapの要素のsubTasksをmutableに書き換えていく
  const taskMap = new Map<string, Task>(
    taskRecords.map((r) => [
      r.id,
      {
        id: r.id,
        title: r.title,
        description: r.description,
        order: r.order,
        parentId: r.parentId,
        subTasks: [],
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
