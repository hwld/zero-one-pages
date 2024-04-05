import { z } from "zod";
import { CreateTaskInput, UpdateTaskInput } from "./api";
import { initialTasks } from "./data";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.union([z.literal("done"), z.literal("todo")]),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
});
export type Task = z.infer<typeof taskSchema>;

export type TaskStoreErrorSimulationScope = "getAll" | "get";
class TaskStore {
  private allTasks: Task[] = initialTasks;
  private errorSimulationScopes: Set<TaskStoreErrorSimulationScope> = new Set();

  private throwErrorForMode(mode: TaskStoreErrorSimulationScope) {
    if (this.errorSimulationScopes.has(mode)) {
      throw new Error("simulated error");
    }
  }

  public getAll() {
    this.throwErrorForMode("getAll");
    return this.allTasks;
  }

  public get(id: string) {
    this.throwErrorForMode("get");
    return this.allTasks.find((t) => t.id === id);
  }

  public add(input: CreateTaskInput): Task {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: "todo",
      createdAt: new Date(),
      completedAt: undefined,
    };

    this.allTasks = [...this.allTasks, newTask];

    return newTask;
  }

  public update(input: UpdateTaskInput & { id: string }): Task | undefined {
    this.allTasks = this.allTasks.map((t) => {
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

    const updatedTask = this.get(input.id);
    return updatedTask;
  }

  public updateTaskStatuses(input: {
    status: Task["status"];
    selectedTaskIds: string[];
  }) {
    this.allTasks = this.allTasks.map((t) => {
      if (t.status !== input.status && input.selectedTaskIds.includes(t.id)) {
        return {
          ...t,
          status: input.status,
          completedAt: input.status === "done" ? new Date() : undefined,
        };
      }
      return t;
    });
  }

  public remove(targetIds: string[]) {
    this.allTasks = this.allTasks.filter((t) => !targetIds.includes(t.id));
  }

  public clear() {
    this.allTasks = [];
  }

  public reset() {
    this.allTasks = initialTasks;
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
