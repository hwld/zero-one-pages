"use client";
import { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar/sidebar";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DefaultQueryClientProvider>
      <div className="flex h-[100dvh] bg-stone-50 text-sm text-neutral-900">
        <Sidebar />
        <div className="w-full overflow-hidden">{children}</div>
      </div>
    </DefaultQueryClientProvider>
  );
};

export default Layout;
