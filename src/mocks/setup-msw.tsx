"use client";
import { todo2Handlers } from "../app/todo-2/_mocks/api";
import { useEffect } from "react";
import { setupWorker } from "msw/browser";
import { todo1Handlers } from "@/app/todo-1/_mocks/api";

export const SetupMsw: React.FC = () => {
  // useEffectでmswを初期化すると、初期化が完了する前に送られたリクエストではエラーになってしまう。
  // 他に方法が思いつかないので、tanstack-queryのretryでごまかす
  useEffect(() => {
    const handlers = [...todo1Handlers, ...todo2Handlers];
    const worker = setupWorker(...handlers);

    worker.start({
      onUnhandledRequest: "bypass",
    });

    return () => worker.stop();
  }, []);

  return null;
};
