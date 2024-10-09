import { projectApiHandlers } from "./taskbox/project/api";
import { taskApiHandlers } from "./task/api";
import { taskboxApiHandlers } from "./taskbox/api";

export const todoistApiHandler = [
  ...taskApiHandlers,
  ...taskboxApiHandlers,
  ...projectApiHandlers,
];
