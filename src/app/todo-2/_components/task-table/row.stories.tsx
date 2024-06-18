import { Meta, StoryObj } from "@storybook/react";
import { TaskTableRow } from "./row";
import { defaultStoryMeta } from "../../story-meta";
import { initialTasks } from "../../_mocks/data";
import { TasksProvider } from "../../_contexts/tasks-provider";
import {
  MockTaskSelectionProvider,
  TaskSelectionContext,
} from "../../_contexts/task-selection-provider";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "@storybook/test";
import { useState } from "react";
import { getTaskStatusLabel } from "../../_mocks/task-store";
import { HttpResponse, http } from "msw";
import {
  Todo2API,
  UpdateTaskInput,
  updateTaskInputSchema,
} from "../../_mocks/api";
import { z } from "zod";
import { getRouter } from "@storybook/nextjs/router.mock";
import { Routes } from "../../_lib/routes";
import { TaskPagingProvider } from "../../_contexts/task-paging-provider";

const dummyTask = initialTasks[0];

const mockToggleSelection = fn();
const mockUpdateTask = fn();
const mockDeleteTask = fn();

const meta = {
  ...defaultStoryMeta,
  component: TaskTableRow,
  title: "Todo2/TaskTableRow",
  parameters: {
    msw: {
      handlers: [
        http.put(Todo2API.task(), async ({ params, request }) => {
          const input = updateTaskInputSchema.parse(await request.json());
          mockUpdateTask({ id: params.id, ...input });

          return HttpResponse.json(dummyTask);
        }),

        http.delete(Todo2API.deleteTasks(), async ({ request }) => {
          const input = z.array(z.string()).parse(await request.json());
          mockDeleteTask(input);

          return HttpResponse.json({});
        }),
      ],
    },
  },
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);

      const selectionContext: TaskSelectionContext = {
        selectedTaskIds: selectedIds,
        selectTaskIds: () => {},
        toggleTaskSelection: (id) => {
          mockToggleSelection(id);
          setSelectedIds((ids) =>
            ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
          );
        },
        unselectAllTasks: () => {},
        unselectTaskIds: () => {},
      };

      return (
        <TaskPagingProvider>
          <TasksProvider>
            <MockTaskSelectionProvider value={selectionContext}>
              <table>
                <tbody>
                  <Story />
                </tbody>
              </table>
            </MockTaskSelectionProvider>
          </TasksProvider>
        </TaskPagingProvider>
      );
    },
  ],
} satisfies Meta<typeof TaskTableRow>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { task: dummyTask },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement.parentElement!);

    await step("選択状態を切り替えることができる", async () => {
      const toggleSelection = await canvas.findByRole("checkbox", {
        name: "選択状態を切り替える",
      });

      await userEvent.click(toggleSelection);
      await userEvent.click(toggleSelection);

      await waitFor(async () => {
        await expect(mockToggleSelection).toHaveBeenCalledTimes(2);
        await expect(mockToggleSelection).toHaveBeenNthCalledWith(
          1,
          args.task.id,
        );
        await expect(mockToggleSelection).toHaveBeenNthCalledWith(
          2,
          args.task.id,
        );
      });

      clearAllMocks();
    });

    await step("完了状態を切り替えるAPIが呼ばれる", async () => {
      const toggleStatus = await canvas.findByRole("button", {
        name: getTaskStatusLabel(args.task.status),
      });

      await userEvent.click(toggleStatus);

      await waitFor(async () => {
        await expect(mockUpdateTask).toHaveBeenCalledTimes(1);
        await expect(mockUpdateTask).toHaveBeenCalledWith(
          expect.objectContaining({
            id: args.task.id,
            ...updateTaskInputSchema.parse(args.task),
            status: args.task.status === "done" ? "todo" : "done",
          } satisfies UpdateTaskInput & { id: string }),
        );
      });
    });

    await step("タスクの詳細ページに遷移できる", async () => {
      const link = await canvas.findByRole("link", { name: args.task.title });

      await userEvent.click(link);

      await waitFor(async () => {
        await expect(getRouter().push).toHaveBeenCalledTimes(1);
        await expect(getRouter().push).toHaveBeenCalledWith(
          Routes.detail(args.task.id),
          expect.anything(),
          expect.anything(),
        );
      });
    });

    await step("タスクの削除APIが呼ばれる", async () => {
      const openButton = await canvas.findByRole("button", {
        name: "削除ダイアログを開く",
      });

      await userEvent.click(openButton);

      const deleteButton = await canvas.findByRole("button", {
        name: "削除する",
      });
      const closeButton = await canvas.findByRole("button", {
        name: "キャンセルする",
      });

      await userEvent.click(deleteButton);
      await userEvent.click(closeButton);

      await waitFor(async () => {
        await expect(mockDeleteTask).toHaveBeenCalledTimes(1);
        await expect(mockDeleteTask).toHaveBeenCalledWith([args.task.id]);
      });
    });
  },
};
