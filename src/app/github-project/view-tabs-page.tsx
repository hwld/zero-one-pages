"use client";
import { GhostIcon, PlusIcon } from "lucide-react";
import React, { ReactNode } from "react";
import { ViewTabButton, ViewTabLink } from "./_components/view-tab";
import { useSearchParams } from "next/navigation";
import { useViewSummaries } from "./_queries/use-view-summaries";
import { useView } from "./_queries/use-view";
import { ButtonLink } from "./_components/button";
import { SlicerPanel } from "./_components/slicer-panel/slicer-panel";
import { MainPanel } from "./_components/main-panel";
import { LoadingAnimation } from "./_components/loading-animation";
import { AnimatePresence, motion } from "framer-motion";
import { CreateViewDialogTrigger } from "./_components/create-view-dialog";
import { Routes } from "./routes";
import { Panel, PanelGroup } from "react-resizable-panels";
import { PanelResizeHandle } from "./_components/panel-resize-handle";

const PageLayout: React.FC<{ tabs?: ReactNode; content: ReactNode }> = ({
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
  const { data: viewSummaries, status: viewSummariesStatus } =
    useViewSummaries();

  const firstViewId = viewSummaries ? viewSummaries[0].id : undefined;
  const viewId = useSearchParams().get("viewId") ?? firstViewId;
  const { data: view, status: viewStatus } = useView(viewId);

  if (viewSummariesStatus === "error" || viewStatus === "error") {
    return (
      <PageLayout
        content={
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
        }
      />
    );
  }

  return (
    <PageLayout
      tabs={
        viewSummariesStatus === "pending" ? undefined : (
          <>
            {viewSummaries.map((summary) => {
              return (
                <ViewTabLink
                  viewSummary={summary}
                  href={Routes.home({ viewId: summary.id })}
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
        )
      }
      content={
        <>
          {view && (
            <PanelGroup
              key={view.id}
              direction="horizontal"
              autoSaveId="content"
            >
              <Panel minSize={20} defaultSize={20} maxSize={40}>
                <SlicerPanel columns={view.columns} />
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={100}>
                <MainPanel view={view} />
              </Panel>
            </PanelGroup>
          )}
          <AnimatePresence>
            {viewStatus === "pending" && (
              <div className="absolute top-0 grid size-full place-content-center place-items-center">
                <motion.div exit={{ opacity: 0 }}>
                  <LoadingAnimation />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      }
    />
  );
};
