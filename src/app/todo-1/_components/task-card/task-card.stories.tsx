import { Meta, StoryObj } from "@storybook/react";
import { TaskCard } from "./task-card";
import { defaultStoryMeta } from "../../story-meta";
import { initialTasks } from "../../_mocks/data";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { http } from "msw";
import { Todo1API, updateTaskInputSchema } from "../../_mocks/api";

const updateTaskMock = fn();
const deleteTaskMock = fn();
const task = initialTasks[0];

const meta = {
  ...defaultStoryMeta,
  title: "Todo1/TaskCard",
  component: TaskCard,
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.put(Todo1API.task(), async ({ params, request }) => {
          const input = updateTaskInputSchema.parse(await request.json());
          updateTaskMock({ id: params.id as string, ...input });
        }),
        http.delete(Todo1API.task(), async ({ params }) => {
          deleteTaskMock(params.id);
        }),
      ],
    },
  },
  args: { task },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentElement!);
    const checkbox = canvas.getByRole("checkbox");
    const editTrigger = canvas.getByLabelText("edit-title");
    const deleteTrigger = canvas.getByLabelText("open-delete-dialog");

    await step("完了状態の更新APIが呼ばれる", async () => {
      await userEvent.click(checkbox);

      await waitFor(() =>
        Promise.all([
          expect(updateTaskMock).toHaveBeenCalledTimes(1),
          expect(updateTaskMock).toHaveBeenCalledWith(
            expect.objectContaining({
              id: task.id,
              done: !task.done,
            }),
          ),
        ]),
      );

      updateTaskMock.mockClear();
    });

    await step("タイトル更新APIが呼ばれる", async () => {
      await userEvent.click(editTrigger);

      const titleInput = canvas.getByRole("textbox");
      const updatedTitle = "update";

      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, `${updatedTitle}{enter}`);

      await waitFor(() =>
        Promise.all([
          expect(updateTaskMock).toHaveBeenCalledTimes(1),
          expect(updateTaskMock).toHaveBeenCalledWith(
            expect.objectContaining({ id: task.id, title: updatedTitle }),
          ),
        ]),
      );

      updateTaskMock.mockClear();
    });

    await step("削除APIが呼ばれる", async () => {
      await userEvent.click(deleteTrigger);

      const deleteButton = await canvas.findByLabelText("action");
      await userEvent.click(deleteButton);

      await waitFor(() =>
        Promise.all([
          expect(deleteTaskMock).toHaveBeenCalledTimes(1),
          expect(deleteTaskMock).toHaveBeenCalledWith(task.id),
        ]),
      );

      const closeButton = await canvas.findByLabelText("close-dialog");
      await userEvent.click(closeButton);
    });
  },
};

export const Done: Story = {
  args: { task: { ...task, done: true } },
};
