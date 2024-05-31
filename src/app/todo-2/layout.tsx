"use client";

import { ReactNode, Suspense } from "react";
import { TasksProvider, useTasksData } from "./_contexts/tasks-provider";
import clsx from "clsx";
import { Sidebar } from "./_components/side-bar/side-bar";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";
import { useBodyBgColor } from "@/lib/useBodyBgColor";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { scrollTargetRef } = useTasksData();

  const bgClass = "bg-zinc-900";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "flex h-screen gap-6 overflow-hidden text-zinc-200",
        bgClass,
      )}
    >
      <div className="sticky top-0 py-6 pl-6">
        <Sidebar />
      </div>
      <div
        ref={scrollTargetRef}
        className="flex w-full flex-col gap-4 overflow-auto py-6 pr-6"
      >
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
};

const LayoutWithProviders: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <DefaultQueryClientProvider>
      <TasksProvider>
        <Layout>{children}</Layout>
      </TasksProvider>
    </DefaultQueryClientProvider>
  );
};

export default LayoutWithProviders;
