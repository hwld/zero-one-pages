import { Meta, StoryObj } from "@storybook/react";
import { defaultStoryMeta } from "../story-meta";
import { expect, fn, userEvent, within } from "@storybook/test";
import { AddTaskButton } from "./add-task-button";
import { Todo2API } from "../_mocks/api";
import { http } from "msw";

const createTaskMock = fn();

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/AddTaskButton",
  component: AddTaskButton,
} satisfies Meta<typeof AddTaskButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: { handlers: [http.post(Todo2API.createTask(), createTaskMock)] },
  },
  play: async ({ canvasElement, step }) => {
    await step("タイトルのみのタスクをキーボードだけで作成できる", async () => {
      const canvas = within(canvasElement.parentElement!);

      await userEvent.keyboard("{meta>}k");

      const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");
      await userEvent.type(titleInput, "title{enter}", { delay: 50 });

      await expect(createTaskMock).toHaveBeenCalledTimes(1);
    });
  },
};
