import { Meta } from "@storybook/react";
import { todo2Handlers } from "./_backend/api";
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
            <div className="h-full text-zinc-200">
              <Story />
            </div>
          </DefaultQueryClientProvider>
        </SetupCompletedMswProvider>
      );
    },
  ],
} satisfies Meta<unknown>;
