import { HttpResponse, delay, http } from "msw";
import { GitHubProjectAPI } from "../api-routes";
import { TaskStatus, taskStatusSchema, taskStatusStore } from "./store";
import { fetcher } from "@/lib/fetcher";
import { z } from "zod";

export const fetchAllTaskStatus = async (): Promise<TaskStatus[]> => {
  const res = await fetcher.get(GitHubProjectAPI.allTaskStatus());
  const json = await res.json();
  const allTaskStatus = z.array(taskStatusSchema).parse(json);

  return allTaskStatus;
};

export const taskStatusApiHandler = [
  http.get(GitHubProjectAPI.allTaskStatus(), async () => {
    await delay();

    const taskStatuses = taskStatusStore.getAll();
    return HttpResponse.json(taskStatuses);
  }),
];
