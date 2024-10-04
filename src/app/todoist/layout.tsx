"use client";
import { ReactNode, Suspense } from "react";
import { Sidebar } from "./_components/sidebar/sidebar";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";
import { SidebarContextProvider } from "./_components/sidebar/provider";

export const appHeaderHeightName = "--app-header-height";

const Layout: React.FC<{ children: ReactNode; modal: ReactNode }> = ({
  children,
  modal,
}) => {
  return (
    <SidebarContextProvider>
      <DefaultQueryClientProvider>
        <div
          className="flex h-[100dvh] bg-stone-50 text-sm text-neutral-900"
          style={{ [appHeaderHeightName as string]: "56px" }}
        >
          <Suspense>
            <Sidebar />
            <div className="w-full overflow-hidden">{children}</div>
            {modal}
          </Suspense>
        </div>
      </DefaultQueryClientProvider>
    </SidebarContextProvider>
  );
};

export default Layout;
