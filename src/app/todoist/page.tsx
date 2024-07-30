"use client";

import { Sidebar } from "./_components/sidebar/sidebar";

const Page: React.FC = () => {
  return (
    <div className="text-neutral-00 flex h-[100dvh] bg-stone-50 text-sm">
      <Sidebar />
      <div></div>
    </div>
  );
};

export default Page;
