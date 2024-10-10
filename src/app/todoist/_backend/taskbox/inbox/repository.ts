import { taskRepository } from "../../task/repository";
import { initialData } from "./data";
import type { Inbox } from "./model";

export type InboxRecord = { taskboxId: string };

class InboxRepository {
  private inbox: InboxRecord = initialData;

  public get = (): Inbox => {
    const taskCount = taskRepository.getManyByTaskboxId(
      this.inbox.taskboxId,
    ).length;

    return { taskboxId: this.inbox.taskboxId, taskCount: taskCount };
  };
}

export const inboxRepository = new InboxRepository();
