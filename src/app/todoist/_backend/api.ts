import { projectApiHandlers } from "./taskbox/project/api";
import { taskApiHandlers } from "./task/api";

export const todoistApiHandler = [...taskApiHandlers, ...projectApiHandlers];
