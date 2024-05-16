"use client";
import { PropsWithChildren } from "react";
import { ToastProvider } from "./_components/toast";
import { DeleteEventProvider } from "./_features/event/use-delete-event";
import { MinuteClockProvider } from "./_components/use-minute-clock";
import { AppStateProvider } from "./_components/use-app-state";
import { QueryClientProvider } from "./_providers/query-client-provider";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ToastProvider>
      <MinuteClockProvider>
        <QueryClientProvider>
          <AppStateProvider>
            <DeleteEventProvider>{children}</DeleteEventProvider>
          </AppStateProvider>
        </QueryClientProvider>
      </MinuteClockProvider>
    </ToastProvider>
  );
};

export default Layout;
