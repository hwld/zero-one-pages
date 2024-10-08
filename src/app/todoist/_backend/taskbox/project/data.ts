import { ProjectRecord } from "../../project/repository";

export const initialData: ProjectRecord[] = [
  {
    taskboxId: "1",
    parentId: null,
    label: "project 1",
    order: 0,
  },
  {
    taskboxId: "1-1",
    parentId: "1",
    label: "project 1-1",
    order: 0,
  },
  {
    taskboxId: "1-1-1",
    parentId: "1-1",
    label: "project 1-1-1",
    order: 0,
  },
  {
    taskboxId: "1-2",
    parentId: "1",
    label: "project 1-2",
    order: 1,
  },
  {
    taskboxId: "2",
    parentId: null,
    label: "project 2",
    order: 1,
  },
  {
    taskboxId: "3",
    parentId: null,
    label: "project 3",
    order: 2,
  },
  {
    taskboxId: "4",
    parentId: null,
    label: "project 4",
    order: 3,
  },
];
