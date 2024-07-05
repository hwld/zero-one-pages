"use client";

import clsx from "clsx";
import { SearchParamsError } from "./use-search-params";
import { GithubProjectBgColorClass } from "./page";
import { ButtonLink } from "./_components/button";
import { Routes } from "./routes";

const ErrorPage = ({ error }: { error: Error }) => {
  const isSearchParamsError = error instanceof SearchParamsError;

  return (
    <div
      className={clsx(
        "grid h-dvh w-dvw place-content-center place-items-center gap-4 text-sm text-neutral-100",
        GithubProjectBgColorClass,
      )}
    >
      {isSearchParamsError ? (
        <SearchParamsErrorContent />
      ) : (
        <>
          <div className="space-y-1 text-center">
            <h1 className="text-lg font-bold">エラーが発生しました</h1>
            <p>ページを更新して、問題が解決するか試してみてください</p>
          </div>
        </>
      )}
    </div>
  );
};

const SearchParamsErrorContent = () => {
  return (
    <>
      <div className="space-y-1 text-center">
        <h1 className="text-lg font-bold">エラーが発生しました</h1>
        <p>正しくないURLが渡されたため、エラーが発生しました。</p>
      </div>
      <ButtonLink color="primary" href={Routes.home({})} external>
        ホームに戻る
      </ButtonLink>
    </>
  );
};

export default ErrorPage;
