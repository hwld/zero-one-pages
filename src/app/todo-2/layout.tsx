"use client";

import { ReactNode } from "react";
import { TasksProvider, useTasksData } from "./_contexts/tasks-provider";
import "./style.css";
import clsx from "clsx";
import { Inter } from "next/font/google";
import { Sidebar } from "./_components/side-bar/side-bar";
import { useSetupWorker } from "@/mocks/browser";
import { handlers } from "./_mocks/api";

const inter = Inter({ subsets: ["latin"] });

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { scrollTargetRef } = useTasksData();

  useSetupWorker(handlers);

  return (
    <div
      className={clsx(
        inter.className,
        "flex h-screen gap-6 overflow-hidden bg-zinc-900 text-zinc-300",
      )}
    >
      <div className="sticky top-0 py-6 pl-6">
        <Sidebar />
      </div>
      <div
        ref={scrollTargetRef}
        className="flex w-full flex-col gap-4 overflow-auto py-6 pr-6"
      >
        {children}
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
