"use client";

import { ReactNode } from "react";
import { TasksProvider } from "./_contexts/tasks-provider";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <TasksProvider>{children}</TasksProvider>;
};

export default Layout;
