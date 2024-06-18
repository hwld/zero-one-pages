import { TasksProvider } from "../../_contexts/tasks-provider";
import { defaultStoryMeta } from "../../story-meta";
import { Meta, StoryObj } from "@storybook/react";
import { LoadingTaskTable } from "./loading-task-table";
import { TaskSortProvider } from "../../_contexts/task-sort-provider";

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/LoadingTaskTable",
  component: LoadingTaskTable,
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      return (
        <TasksProvider>
          <TaskSortProvider>
            <div className="flex h-[450px]">
              <Story />
            </div>
          </TaskSortProvider>
        </TasksProvider>
      );
    },
  ],
} satisfies Meta<typeof LoadingTaskTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
