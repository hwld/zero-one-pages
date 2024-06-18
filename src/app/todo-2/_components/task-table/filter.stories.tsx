import { Meta, StoryObj } from "@storybook/react";
import { TaskTableFilter } from "./filter";
import { defaultStoryMeta } from "../../story-meta";
import { TaskFilterProvider } from "../../_contexts/task-filter-provider";
import {
  MockTaskPaginProvider,
  TaskPagingContext,
} from "../../_contexts/task-paging-provider";
import { useMemo } from "react";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "@storybook/test";

const mockSetPage = fn();

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/TaskTableFilter",
  component: TaskTableFilter,
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      const value = useMemo((): TaskPagingContext => {
        return {
          page: 0,
          limit: 0,
          setPage: mockSetPage,
          setLimit: () => {},
        };
      }, []);

      return (
        <MockTaskPaginProvider value={value}>
          <TaskFilterProvider>
            <Story />
          </TaskFilterProvider>
        </MockTaskPaginProvider>
      );
    },
  ],
} satisfies Meta<typeof TaskTableFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentElement!);
    const filterOpenButton = await canvas.findByRole("button", {
      name: "絞り込み",
    });

    await step("フィルターを設定すると、ページが1に設定される", async () => {
      await userEvent.click(filterOpenButton);

      await userEvent.click(
        await canvas.findByRole("menuitem", { name: "Todo" }),
      );
      await userEvent.click(
        await canvas.findByRole("menuitem", { name: "Done" }),
      );
      await userEvent.click(
        await canvas.findByRole("menuitem", { name: "未選択" }),
      );

      await waitFor(async () => {
        await expect(mockSetPage).toHaveBeenCalledTimes(3);
        for (let i = 0; i < 3; i++) {
          await expect(mockSetPage).toHaveBeenNthCalledWith(i + 1, 1);
        }
      });

      clearAllMocks();
    });

    await step("フィルターを解除すると、ページが1に設定される", async () => {
      await userEvent.click(
        await canvas.findByRole("menuitem", { name: "絞り込みを解除する" }),
      );

      await waitFor(async () => {
        await expect(mockSetPage).toHaveBeenCalledTimes(1);
        await expect(mockSetPage).toHaveBeenCalledWith(1);
      });

      clearAllMocks();
    });
  },
};
