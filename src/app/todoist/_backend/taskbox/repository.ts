import { initialData } from "./data";
import type { Taskbox } from "./model";

class TaskboxRepository {
  private taskboxes: Taskbox[] = initialData;

  public get = (id: string): Taskbox | undefined => {
    return this.taskboxes.find((b) => b.id === id);
  };

  public getAll = (): Taskbox[] => {
    return this.taskboxes;
  };

  public add = (id: string) => {
    this.taskboxes = [...this.taskboxes, { id }];
  };

  public remove = (idOrIds: string | string[]) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    this.taskboxes = this.taskboxes.filter((b) => !ids.includes(b.id));
  };
}

export const taskboxRepository = new TaskboxRepository();
