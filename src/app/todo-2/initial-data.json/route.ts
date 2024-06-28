import { faker } from "@faker-js/faker/locale/ja";
import { Task } from "../_backend/task-store";

const initialTasks: Task[] = [...new Array(121)].map(() => {
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
    description: faker.lorem.lines({ min: 5, max: 40 }),
    createdAt,
    ...statusEntry,
  };
});

export const GET = async () => {
  return Response.json(initialTasks);
};
