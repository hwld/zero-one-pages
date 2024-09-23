import { projectApiHandlers } from "./project/api";
import { taskApiHandlers } from "./task/api";

export const todoistApiHandler = [...taskApiHandlers, ...projectApiHandlers];
