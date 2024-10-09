import type { TaskRecord } from "./repository";
import { initialData as initialInboxData } from "../taskbox/inbox/data";

export const initialData: TaskRecord[] = [
  {
    id: "1",
    title: "task1",
    description: "",
    done: false,
    order: 0,
    parentId: null,
    taskboxId: initialInboxData.taskboxId,
  },
  {
    id: "2",
    title: "task2",
    description: "task2の説明",
    done: false,
    order: 1,
    parentId: null,
    taskboxId: initialInboxData.taskboxId,
  },
  {
    id: "3",
    title: "task3",
    description: "task3の説明",
    done: true,
    order: 2,
    parentId: null,
    taskboxId: initialInboxData.taskboxId,
  },
];
