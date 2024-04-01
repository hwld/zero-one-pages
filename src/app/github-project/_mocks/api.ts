import { taskApiHandler } from "./task/api";
import { viewApiHandler } from "./view/api";

export const githubProjcetApiHandler = [...viewApiHandler, ...taskApiHandler];
