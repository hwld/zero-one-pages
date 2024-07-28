"use client";
import { Sidebar } from "./_components/sidebar";

const Page: React.FC = () => {
  return (
    <div className="flex h-[100dvh] bg-neutral-100 text-neutral-700">
      <Sidebar />
      <div></div>
    </div>
  );
};

export default Page;
