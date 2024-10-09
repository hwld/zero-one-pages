import type { Taskboxes } from "../../_backend/taskbox/schema";
import { ProjectExpansionMap } from "../project/logic/expansion-map";
import { toProjectNodes, type ProjectNode } from "../project/logic/project";

export type TaskboxNodes = Pick<Taskboxes, "inbox"> & {
  projectNodes: ProjectNode[];
};

export const toTaskboxNodes = (taskboxes: Taskboxes): TaskboxNodes => {
  return {
    inbox: taskboxes.inbox,
    projectNodes: toProjectNodes(taskboxes.projects, new ProjectExpansionMap()),
  };
};
