import { Meta, StoryObj } from "@storybook/react";
import { TaskTableFilter } from "./filter";
import { defaultStoryMeta } from "../../story-meta";
import { TaskFilterProvider } from "../../_contexts/task-filter-provider";
import { TaskPagingProvider } from "../../_contexts/task-paging-provider";

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/TaskTableFilter",
  component: TaskTableFilter,
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      return (
        <TaskPagingProvider>
          <TaskFilterProvider>
            <Story />
          </TaskFilterProvider>
        </TaskPagingProvider>
      );
    },
  ],
} satisfies Meta<typeof TaskTableFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
