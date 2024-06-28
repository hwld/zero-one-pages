import { z } from "zod";
import { CreateTaskInput, UpdateTaskInput } from "./api";
import { initialTasks } from "./data";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

class TaskStore {
  private tasks: Task[] = initialTasks;
  private isSimulatingError = false;

  private throwSimulatedError() {
    if (this.isSimulatingError) {
      throw new Error("simulated error");
    }
  }

  public getAll(): Task[] {
    this.throwSimulatedError();
    return this.tasks;
  }

  public get(id: string): Task | undefined {
    this.throwSimulatedError();
    return this.tasks.find((t) => t.id === id);
  }

  public add(input: CreateTaskInput): Task {
    this.throwSimulatedError();

    const now = new Date().toLocaleString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: "",
      done: false,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks = [...this.tasks, newTask];

    return newTask;
  }

  public update(input: UpdateTaskInput & { id: string }): Task | undefined {
    this.throwSimulatedError();

    this.tasks = this.tasks.map((t) => {
      if (t.id === input.id) {
        return {
          ...t,
          title: input.title,
          description: input.description,
          done: input.done,
          updatedAt: new Date().toLocaleString(),
        };
      }
      return t;
    });

    const updatedTask = this.tasks.find((t) => t.id === input.id);
    return updatedTask;
  }

  public remove(id: string) {
    this.throwSimulatedError();

    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  public clear() {
    this.tasks = [];
  }

  public reset() {
    this.tasks = initialTasks;
  }

  public startErrorSimulation() {
    this.isSimulatingError = true;
  }

  public stopErrorSimulation() {
    this.isSimulatingError = false;
  }
}

export const taskStore = new TaskStore();
