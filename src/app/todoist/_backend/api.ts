import { projectApiHandlers } from "./taskbox/project/api";
import { taskApiHandlers } from "./task/api";
import { taskboxApiHandlers } from "./taskbox/api";
import { inboxApiHandlers } from "./taskbox/inbox/api";

export const todoistApiHandler = [
  ...taskboxApiHandlers,
  ...inboxApiHandlers,
  ...projectApiHandlers,
  ...taskApiHandlers,
];
