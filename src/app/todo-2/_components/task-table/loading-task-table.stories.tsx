import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
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
        <ScrollableRootProvider>
          <TaskTablePagingProvider>
            <TaskTableSortProvider>
              <div className="flex h-[450px]">
                <Story />
              </div>
            </TaskTableSortProvider>
          </TaskTablePagingProvider>
        </ScrollableRootProvider>
      );
    },
  ],
} satisfies Meta<typeof LoadingTaskTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
