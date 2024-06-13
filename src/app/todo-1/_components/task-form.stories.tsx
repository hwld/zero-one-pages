import { Meta, StoryObj } from "@storybook/react";
import { TaskForm } from "./task-form";
import { defaultStoryMeta } from "../story-meta";
import { expect, userEvent, waitFor, within } from "@storybook/test";

const meta = {
  ...defaultStoryMeta,
  title: "Todo1/TaskForm",
  component: TaskForm,
  args: { onSubmit: () => {} },
} satisfies Meta<typeof TaskForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");

    await userEvent.type(titleInput, "title{enter}", { delay: 50 });

    await waitFor(() => expect(titleInput).toHaveValue(""));
  },
};

export const NoTitleError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");

    await userEvent.type(titleInput, "{enter}");

    await waitFor(() => expect(canvas.getByRole("alert")).toBeInTheDocument());
  },
};

export const MaxLengthError: Story = {
  play: async ({ canvasElement }) => {
    // canvasElementを直接使うと、portalが見えない
    // https://github.com/storybookjs/storybook/issues/16971
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");

    await userEvent.click(titleInput);
    await userEvent.paste(`${"a".repeat(200)}`);
    await userEvent.type(titleInput, "{enter}");

    await waitFor(() => expect(canvas.getByRole("alert")).toBeInTheDocument());
  },
};
