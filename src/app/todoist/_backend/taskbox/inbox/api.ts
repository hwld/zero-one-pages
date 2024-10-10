import { delay, http, HttpResponse } from "msw";
import { TodoistAPI } from "../../routes";
import { fetcher } from "../../../../../lib/fetcher";
import { inboxDetailSchema, type InboxDetail } from "./model";
import { inboxRepository } from "./repository";
import { taskRepository } from "../../task/repository";

export const fetchInbox = async (): Promise<InboxDetail> => {
  const res = await fetcher.get(TodoistAPI.inbox());
  const json = await res.json();
  const inbox = inboxDetailSchema.parse(json);

  return inbox;
};

export const inboxApiHandlers = [
  http.get(TodoistAPI.inbox(), async () => {
    await delay();

    const inboxSummary = inboxRepository.get();

    const inbox: InboxDetail = {
      taskboxId: inboxSummary.taskboxId,
      tasks: taskRepository.getManyByTaskboxId(inboxSummary.taskboxId),
      taskCount: inboxSummary.taskCount,
    };

    return HttpResponse.json(inbox);
  }),
];
