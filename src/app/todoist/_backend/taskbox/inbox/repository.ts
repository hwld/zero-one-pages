import { initialData } from "./data";
import type { Inbox } from "./model";

class InboxRepository {
  private inbox: Inbox = initialData;

  public get = (): Inbox => {
    return this.inbox;
  };
}

export const inboxRepository = new InboxRepository();
