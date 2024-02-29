"use client";

import { NextPage } from "next";
import { Menu } from "./_components/menu/menu";

const Page: NextPage = () => {
  return (
    <div className="flex h-[100dvh] justify-center bg-neutral-900 pt-[50px] text-neutral-900">
      <div className="mt-[500px]">
        <Menu />
      </div>
    </div>
  );
};

export default Page;
