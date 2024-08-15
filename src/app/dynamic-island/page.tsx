"use client";

import { NextPage } from "next";
import { AppControl } from "./_components/app-control/app-control";
import clsx from "clsx";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

const Page: NextPage = () => {
  const bgClass = "bg-neutral-200";
  useBodyBgColor(bgClass);

  return (
    <div className={clsx("h-dvh w-dvw pt-5", bgClass)}>
      <div className="m-auto w-min">
        <AppControl />
      </div>
    </div>
  );
};
export default Page;
