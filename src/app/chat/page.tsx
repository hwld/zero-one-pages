"use client";

import { NextPage } from "next";
import { ServerSidebar } from "./_components/server-sidebar/server-sidebar";
import { SideBar } from "./_components/sidebar/sidebar";
import { ChatPanel } from "./_components/chat-panel/chat-panel";

const Page: NextPage = () => {
  return (
    <div className="grid h-dvh grid-cols-[70px_250px_1fr] bg-neutral-100 text-neutral-100">
      <ServerSidebar />
      <SideBar />
      <ChatPanel />
    </div>
  );
};

export default Page;
