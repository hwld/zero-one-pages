"use client";
import { CatIcon, GhostIcon, PlusIcon } from "lucide-react";
import React, { ReactNode } from "react";
import { ViewTabButton, ViewTabLink } from "./_components/view-tab";
import { useSearchParams } from "next/navigation";
import { useViewSummaries } from "./_queries/use-view-summaries";
import { useView } from "./_queries/use-view";
import { Button } from "./_components/button";
import { SlicerPanel } from "./_components/slicer-panel/slicer-panel";
import { MainPanel } from "./_components/main-panel";

const PageLayout: React.FC<{ tabs?: ReactNode; content: ReactNode }> = ({
  tabs,
  content,
}) => {
  return (
    <div className="grid grid-rows-[36px_minmax(0,1fr)]">
      <div className="flex gap-1 border-b border-neutral-600 px-8">{tabs}</div>
      <div className="flex w-[100dvw] bg-neutral-800">{content}</div>
    </div>
  );
};

export const ViewTabsPage: React.FC = () => {
  const { data: viewSummaries, status: viewSummariesStatus } =
    useViewSummaries();

  const firstViewId = viewSummaries ? viewSummaries[0].id : undefined;
  const viewId = useSearchParams().get("viewId") ?? firstViewId;
  const { data: view, status: viewStatus } = useView(viewId);

  if (viewSummariesStatus === "pending" || viewStatus === "pending") {
    return (
      <PageLayout
        content={
          <div className="grid h-full w-full place-content-center place-items-center gap-2 text-neutral-400">
            <CatIcon size={50} className="animate-bounce" />
            <div className="text-sm">One moment please...</div>
          </div>
        }
      />
    );
  }
  if (viewSummariesStatus === "error" || viewStatus === "error" || !viewId) {
    return (
      <PageLayout
        content={
          <div className="-mt-10 grid h-full w-full place-content-center place-items-center gap-6">
            <div className="flex flex-col items-center justify-center gap-2">
              <GhostIcon size={150} />
              <div className="text-center text-sm text-neutral-100">
                データ読み込みに
                <br />
                失敗しました
              </div>
            </div>
            <Button color="primary" onClick={() => window.location.reload()}>
              更新する
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <PageLayout
      tabs={
        <>
          {viewSummaries.map((summary) => {
            return (
              <ViewTabLink
                href={`/github-project?viewId=${summary.id}`}
                key={summary.id}
                active={viewId === summary.id}
              >
                {summary.name}
              </ViewTabLink>
            );
          })}
          <ViewTabButton icon={PlusIcon}>New view</ViewTabButton>
        </>
      }
      content={
        <React.Fragment key={view.id}>
          <SlicerPanel columns={view.columns} />
          <MainPanel view={view} />
        </React.Fragment>
      }
    />
  );
};
