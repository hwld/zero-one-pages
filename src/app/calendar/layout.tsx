"use client";
import { PropsWithChildren } from "react";
import { ToastProvider } from "./_components/toast";
import { DeleteEventProvider } from "./_queries/use-delete-event";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ToastProvider>
      <DeleteEventProvider>{children}</DeleteEventProvider>
    </ToastProvider>
  );
};

export default Layout;
