import { TaskTablePagingProvider } from "./paging-provider";
import { TaskTableSortProvider } from "./sort-provider";
import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
import { defaultStoryMeta } from "../../story-meta";
import { ErrorTaskTable } from "./error-task-table";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/ErrorTaskTable",
  component: ErrorTaskTable,
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
} satisfies Meta<typeof ErrorTaskTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
