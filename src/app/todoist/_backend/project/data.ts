import { ProjectRecord } from "./repository";

export const initialData: ProjectRecord[] = [
  {
    id: "1",
    parentId: null,
    label: "project 1",
    order: 0,
  },
  {
    id: "1-1",
    parentId: "1",
    label: "project 1-1",
    order: 0,
  },
  {
    id: "1-1-1",
    parentId: "1-1",
    label: "project 1-1-1",
    order: 0,
  },
  {
    id: "1-2",
    parentId: "1",
    label: "project 1-2",
    order: 1,
  },
  {
    id: "2",
    parentId: null,
    label: "project 2",
    order: 1,
  },
  {
    id: "3",
    parentId: null,
    label: "project 3",
    order: 2,
  },
  {
    id: "4",
    parentId: null,
    label: "project 4",
    order: 3,
  },
];
