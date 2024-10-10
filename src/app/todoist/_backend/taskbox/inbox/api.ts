import { delay, http, HttpResponse } from "msw";
import { TodoistAPI } from "../../routes";
import { fetcher } from "../../../../../lib/fetcher";
import { inboxDetailSchema, type InboxDetail } from "./model";
import { inboxRepository } from "./repository";

export const fetchInbox = async (): Promise<InboxDetail> => {
  const res = await fetcher.get(TodoistAPI.inbox());
  const json = await res.json();
  const inbox = inboxDetailSchema.parse(json);

  return inbox;
};

export const inboxApiHandlers = [
  http.get(TodoistAPI.inbox(), async () => {
    await delay();

    const detail = inboxRepository.getDetail();

    return HttpResponse.json(detail);
  }),
];
