"use client";
import { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar/sidebar";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DefaultQueryClientProvider>
      <div className="text-neutral-00 flex h-[100dvh] bg-stone-50 text-sm">
        <Sidebar />
        <div className="min-h-full w-full pl-16 pt-8">{children}</div>
      </div>
    </DefaultQueryClientProvider>
  );
};

export default Layout;
