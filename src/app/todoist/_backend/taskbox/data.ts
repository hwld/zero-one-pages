import type { Taskbox } from "./model";
import { initialData as initialInboxData } from "./inbox/data";
import { initialData as initialProjectData } from "./project/data";

export const initialData: Taskbox[] = [
  { id: initialInboxData.taskboxId },
  ...initialProjectData.map((p) => ({ id: p.taskboxId })),
];
