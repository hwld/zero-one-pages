import { z } from "zod";
import { taskStatusSchema, taskStatusStore } from "../task-status/store";
import { viewConfigStore } from "../view/view-config-store";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: taskStatusSchema,
});

export type Task = z.infer<typeof taskSchema>;

class TaskStore {
  private tasks: Task[] = [];

  public getAll(): Task[] {
    return this.tasks;
  }

  public get(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  public getByStatusId(statusId: string): Task[] {
    return this.tasks.filter((t) => t.status.id === statusId);
  }

  public add(input: { title: string; statusId: string }): Task {
    const status = taskStatusStore.get(input.statusId);
    if (!status) {
      throw new Error("Statusが存在しません");
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      status,
    };
    this.tasks = [...this.tasks, newTask];

    viewConfigStore.addTaskToAllConfigs({
      taskId: newTask.id,
      statusId: newTask.status.id,
    });

    return newTask;
  }

  public update(input: { id: string; title: string; statusId: string }) {
    const status = taskStatusStore.get(input.statusId);

    if (!status) {
      throw new Error("statusが存在しません");
    }

    this.tasks = this.tasks.map((t) => {
      if (t.id === input.id) {
        return {
          ...t,
          title: input.title,
          status: status,
        };
      }
      return t;
    });
  }

  public remove(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id);

    viewConfigStore.removeTaskFromAllConfigs(id);
  }
}

export const taskStore = new TaskStore();
