"use client";
import { setupWorker as mswSetupWorker } from "msw/browser";
import { useEffect } from "react";

export const useSetupWorker = (handlers: Parameters<typeof mswSetupWorker>) => {
  // useEffectでmswを初期化すると、初期化が完了する前に送られたリクエストではエラーになってしまう。
  // 他に方法が思いつかないので、tanstack-queryのretryでごまかす
  useEffect(() => {
    const worker = mswSetupWorker(...handlers);
    worker.start({
      onUnhandledRequest: "bypass",
    });

    return () => worker.stop();
  }, [handlers]);
};
