"use client";
import { PropsWithChildren } from "react";
import { ToastProvider } from "./_components/toast";
import { DeleteEventProvider } from "./_features/event/use-delete-event";
import { MinuteClockProvider } from "./_components/use-minute-clock";
import { AppStateProvider } from "./_components/use-app-state";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <MinuteClockProvider>
      <AppStateProvider>
        <ToastProvider>
          <DeleteEventProvider>{children}</DeleteEventProvider>
        </ToastProvider>
      </AppStateProvider>
    </MinuteClockProvider>
  );
};

export default Layout;
