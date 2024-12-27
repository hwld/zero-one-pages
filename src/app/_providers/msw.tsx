import { todo2Handlers } from "../todo-2/_backend/api";
import { setupWorker } from "msw/browser";
import { githubProjcetApiHandler } from "../github-project/_backend/api";
import { calendarApiHandlers } from "../calendar/_backend/api";
import { todoistApiHandler } from "../todoist/_backend/api";
import { todo1Handlers } from "../todo-1/_backend/api";

export const setupMsw = async () => {
  const handlers = [
    ...todo1Handlers,
    ...todo2Handlers,
    ...githubProjcetApiHandler,
    ...calendarApiHandlers,
    ...todoistApiHandler,
  ];
  const worker = setupWorker(...handlers);
  await worker.start({
    onUnhandledRequest: "bypass",
  });
};
