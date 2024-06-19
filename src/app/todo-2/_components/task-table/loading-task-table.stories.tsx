import { TasksProvider } from "../../_contexts/tasks-provider";
import { defaultStoryMeta } from "../../story-meta";
import { Meta, StoryObj } from "@storybook/react";
import { LoadingTaskTable } from "./loading-task-table";
import { TaskTableSortProvider } from "./sort-provider";
import { TaskTablePagingProvider } from "./paging-provider";

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/LoadingTaskTable",
  component: LoadingTaskTable,
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      return (
        <TasksProvider>
          <TaskTablePagingProvider>
            <TaskTableSortProvider>
              <div className="flex h-[450px]">
                <Story />
              </div>
            </TaskTableSortProvider>
          </TaskTablePagingProvider>
        </TasksProvider>
      );
    },
  ],
} satisfies Meta<typeof LoadingTaskTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
