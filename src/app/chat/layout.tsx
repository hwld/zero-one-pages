"use client";

import { ReactNode } from "react";
import { ChatPanel } from "./_components/chat-panel/chat-panel";
import { ServerSidebar } from "./_components/server-sidebar/server-sidebar";
import { SideBar } from "./_components/sidebar/sidebar";
import "./style.css";

const ChatPage: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className="grid h-dvh grid-cols-[70px_250px_1fr] bg-neutral-100 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
      <ServerSidebar />
      <SideBar />
      <ChatPanel />
      <div className="fixed">{children}</div>
    </div>
  );
};

export default ChatPage;
