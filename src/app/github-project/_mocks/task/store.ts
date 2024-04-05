import { z } from "zod";
import { taskStatusSchema, taskStatusStore } from "../task-status/store";
import { viewConfigStore } from "../view/view-config-store";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: taskStatusSchema,
});

export type Task = z.infer<typeof taskSchema>;

export type TaskStoreErrorSimulationScope = "getAll" | "mutation";
class TaskStore {
  private tasks: Task[] = [];
  private errorSimulationScopes: Set<TaskStoreErrorSimulationScope> = new Set();

  private throwErrorForScope(scope: TaskStoreErrorSimulationScope) {
    if (this.errorSimulationScopes.has(scope)) {
      throw new Error("simulated error");
    }
  }

  public getAll(): Task[] {
    this.throwErrorForScope("getAll");
    return this.tasks;
  }

  public get(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  public getByStatusId(statusId: string): Task[] {
    return this.tasks.filter((t) => t.status.id === statusId);
  }

  public add(input: { title: string; statusId: string }): Task {
    this.throwErrorForScope("mutation");

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
    this.throwErrorForScope("mutation");

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
    this.throwErrorForScope("mutation");

    this.tasks = this.tasks.filter((t) => t.id !== id);

    viewConfigStore.removeTaskFromAllConfigs(id);
  }

  public addErrorSimulationScope(scope: TaskStoreErrorSimulationScope) {
    this.errorSimulationScopes.add(scope);
  }

  public removeErrorSimulationScope(scope: TaskStoreErrorSimulationScope) {
    this.errorSimulationScopes.delete(scope);
  }

  public stopErrorSimulation() {
    this.errorSimulationScopes.clear();
  }
}

export const taskStore = new TaskStore();
