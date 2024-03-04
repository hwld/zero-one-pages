import { faker } from "@faker-js/faker/locale/ja";
import { Task } from "../_contexts/tasks-provider";

/**
 *  fakerの依存をバンドルに含めたくなかったので、RouteHandlerとして実行して、
 *  ビルド時にダミーデータが生成されるようにしてみる
 */

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
    description: "description",
    createdAt,
    ...statusEntry,
  };
});

export const GET = async () => {
  return Response.json(initialTasks);
};
