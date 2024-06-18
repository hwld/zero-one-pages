import { Meta } from "@storybook/react";
import { todo2Handlers } from "./_mocks/api";
import { SetupCompletedMswProvider } from "../_providers/msw-provider";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

export const defaultStoryMeta = {
  parameters: {
    backgrounds: { default: "dark" },
    msw: { handlers: [...todo2Handlers] },
  },
  decorators: [
    (Story: React.FC) => {
      return (
        <SetupCompletedMswProvider>
          <DefaultQueryClientProvider>
            <Story />
          </DefaultQueryClientProvider>
        </SetupCompletedMswProvider>
      );
    },
  ],
} satisfies Meta<unknown>;
