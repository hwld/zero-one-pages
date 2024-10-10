"use client";

import { useEffect, useRef } from "react";
import { ButtonLink } from "./_components/button";
import { useSearchParams } from "next/navigation";
import { Routes } from "./routes";

const ErrorPage: React.FC<{ reset: () => void }> = ({ reset }) => {
  const searchParams = useSearchParams().toString();

  const prevSearchParams = useRef("");
  useEffect(() => {
    if (prevSearchParams.current !== searchParams) {
      reset();
    }
    prevSearchParams.current = searchParams;
  }, [reset, searchParams]);

  return (
    <div className="grid size-full place-content-center place-items-center gap-2">
      エラーが発生しました
      <div>
        <ButtonLink href={Routes.inbox()}>ホームに戻る</ButtonLink>
      </div>
    </div>
  );
};

export default ErrorPage;
