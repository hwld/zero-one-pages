import { Meta, StoryObj } from "@storybook/react";
import { TaskForm } from "./task-form";
import { defaultStoryMeta } from "../story-meta";

const meta = {
  ...defaultStoryMeta,
  title: "Todo1/TaskForm",
  component: TaskForm,
} satisfies Meta<typeof TaskForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
