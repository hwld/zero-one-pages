"use client";

import { ReactNode, Suspense } from "react";
import { TasksProvider, useTasksData } from "./_contexts/tasks-provider";
import "./style.css";
import clsx from "clsx";
import { Sidebar } from "./_components/side-bar/side-bar";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { scrollTargetRef } = useTasksData();

  return (
    <div
      className={clsx(
        "flex h-screen gap-6 overflow-hidden bg-zinc-900 text-zinc-200",
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
    <TasksProvider>
      <Layout>{children}</Layout>
    </TasksProvider>
  );
};

export default LayoutWithProviders;
