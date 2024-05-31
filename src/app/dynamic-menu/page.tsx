"use client";

import { NextPage } from "next";
import { Menu } from "./_components/menu/menu";
import { useBodyBgColor } from "@/lib/useBodyBgColor";
import clsx from "clsx";

const Page: NextPage = () => {
  const bgClass = "bg-neutral-900";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "flex h-[100dvh] justify-center pt-[50px] text-neutral-900",
        bgClass,
      )}
    >
      <div className="mt-[500px]">
        <Menu />
      </div>
    </div>
  );
};

export default Page;
