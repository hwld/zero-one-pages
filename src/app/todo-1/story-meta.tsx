import { Meta } from "@storybook/react";
import { todo1Handlers } from "./_mocks/api";
import { SetupCompletedMswProvider } from "../_providers/msw-provider";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

export const defaultStoryMeta = {
  // 上書きできるように、handlers.defaultを使用する。
  parameters: { msw: { handlers: [...todo1Handlers] } },
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
