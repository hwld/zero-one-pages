"use client";

import { NextPage } from "next";
import { AppControl } from "./_components/app-control/app-control";
import "./style.css";

const Page: NextPage = () => {
  return (
    <div className="h-dvh w-dvw bg-neutral-200 pt-5">
      <div className="m-auto w-min">
        <AppControl />
      </div>
    </div>
  );
};
export default Page;
