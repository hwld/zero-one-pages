import { z } from "zod";
import { CreateTaskInput, UpdateTaskInput } from "./api";

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
  private tasks: Task[] = [];

  public getAll(): Task[] {
    return this.tasks;
  }

  public get(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  public add(input: CreateTaskInput): Task {
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
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}

export const taskStore = new TaskStore();
