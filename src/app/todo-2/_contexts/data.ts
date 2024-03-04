import { Task } from "./tasks-provider";
import { faker } from "@faker-js/faker/locale/ja";

faker.seed(111);

export const initialTasks: Task[] = [...new Array(121)].map(() => {
  const createdAt = faker.date.past();

  const statusEntry = faker.helpers.arrayElement([
    { status: "todo", completedAt: undefined },
    {
      status: "done",
      completedAt: faker.date.future({ refDate: createdAt }),
    },
  ] as const);

  return {
    id: crypto.randomUUID(),
    title: faker.lorem.sentence({ min: 5, max: 8 }),
    description: "description",
    createdAt,
    ...statusEntry,
  };
});
