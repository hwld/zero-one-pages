"use client";
import { GhostIcon, InboxIcon, PlusIcon } from "lucide-react";
import React, { ReactNode } from "react";
import { ViewTabButton, ViewTabLink } from "./_components/view-tab";
import { useViewSummaries } from "./_queries/use-view-summaries";
import { useView } from "./_queries/use-view";
import { Button, ButtonLink } from "./_components/button";
import { SlicerPanel } from "./_components/slicer-panel/slicer-panel";
import { MainPanel } from "./_components/main-panel";
import { LoadingAnimation } from "./_components/loading-animation";
import { AnimatePresence, motion } from "framer-motion";
import { CreateViewDialogTrigger } from "./_components/create-view-dialog";
import { HomeSearchParamsSchema, Routes } from "./routes";
import { useSearchParams } from "./use-search-params";
import { ResizablePanel } from "./_components/resizable-panel";

const PageLayout: React.FC<{ tabs?: ReactNode; content?: ReactNode }> = ({
  tabs,
  content,
}) => {
  return (
    <div className="grid min-h-0 grid-rows-[min-content_minmax(0,1fr)]">
      <div className="flex w-full items-stretch overflow-x-auto border-b border-neutral-600 px-8">
        <div className="flex h-[42px] items-stretch">{tabs}</div>
      </div>
      <div className="relative flex overflow-auto bg-neutral-800">
        {content}
      </div>
    </div>
  );
};

export const ViewTabsPage: React.FC = () => {
  const searchParams = useSearchParams(HomeSearchParamsSchema);

  const { data: viewSummaries, status: viewSummariesStatus } =
    useViewSummaries();

  if (viewSummariesStatus === "error") {
    return <PageLayout content={<ErrorContent />} />;
  }

  if (viewSummariesStatus === "pending") {
    return <PageLayout content={<LoadingContent />} />;
  }

  const firstViewId = viewSummaries.at(0)?.id;
  const viewId = searchParams.viewId ?? firstViewId;

  return (
    <PageLayout
      tabs={
        <>
          {viewSummaries.map((summary) => {
            return (
              <ViewTabLink
                viewSummary={summary}
                href={Routes.home({ ...searchParams, viewId: summary.id })}
                key={summary.id}
                active={viewId === summary.id}
              >
                {summary.name}
              </ViewTabLink>
            );
          })}
          <CreateViewDialogTrigger>
            <ViewTabButton icon={PlusIcon}>New view</ViewTabButton>
          </CreateViewDialogTrigger>
        </>
      }
      content={
        viewId ? (
          <ViewContent key={viewId} viewId={viewId} />
        ) : (
          <NoViewContent />
        )
      }
    />
  );
};

const ErrorContent: React.FC = () => {
  return (
    <div className="grid h-full min-h-fit w-full place-content-center place-items-center gap-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <GhostIcon size={150} />
        <div className="text-center text-sm text-neutral-100">
          データ読み込みに
          <br />
          失敗しました
        </div>
      </div>
      <ButtonLink external color="primary" href={Routes.home({})}>
        ホームに戻る
      </ButtonLink>
    </div>
  );
};

const LoadingContent: React.FC = () => {
  return (
    <div className="absolute top-0 grid size-full place-content-center place-items-center">
      <motion.div exit={{ opacity: 0 }}>
        <LoadingAnimation />
      </motion.div>
    </div>
  );
};

const NoViewContent: React.FC = () => {
  return (
    <div className="grid h-full min-h-fit w-full place-content-center place-items-center gap-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <InboxIcon size={150} />
        <div className="text-center text-sm text-neutral-100">
          Viewが存在しません
        </div>
      </div>
      <CreateViewDialogTrigger>
        <Button color="primary">Viewを作成</Button>
      </CreateViewDialogTrigger>
    </div>
  );
};

const ViewContent: React.FC<{ viewId: string }> = ({ viewId }) => {
  const { data: view, status: viewStatus } = useView(viewId);

  if (viewStatus === "error") {
    return <ErrorContent />;
  }

  return (
    <>
      {view && (
        <div className="grid grid-cols-[auto,1fr] grid-rows-1">
          <ResizablePanel
            direction="right"
            minWidth={200}
            defaultSize={{ width: 400 }}
          >
            <SlicerPanel columns={view.columns} />
          </ResizablePanel>
          <MainPanel view={view} />
        </div>
      )}
      <AnimatePresence>
        {viewStatus === "pending" && <LoadingContent />}
      </AnimatePresence>
    </>
  );
};
