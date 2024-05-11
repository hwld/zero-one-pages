"use client";
import { PropsWithChildren } from "react";
import { ToastProvider } from "./_components/toast";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

export default Layout;
