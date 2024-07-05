"use client";
import {
  LineChartIcon,
  MoreHorizontalIcon,
  PanelRightOpenIcon,
} from "lucide-react";
import React, { Suspense, useState } from "react";
import { Tooltip } from "./_components/tooltip";
import {
  AppHeader,
  appHeaderHeightPx,
} from "./_components/app-header/app-header";
import { ButtonGroupItem } from "./_components/button-group-item";
import { ProjectMenuTrigger } from "./_components/project-menu-trigger";
import { Toaster } from "./_components/toast/toaster";
import { ViewTabsPage } from "./view-tabs-page";
import { useGitHubProjectCommands } from "./commands";
import { useBodyBgColor } from "@/lib/useBodyBgColor";
import clsx from "clsx";
import { Panel, PanelGroup } from "react-resizable-panels";
import { TaskDetailPanel } from "./_components/task-detail-panel/task-detail-panel";

export const GithubProjectBgColorClass = "bg-neutral-900";

const GitHubProjectPage: React.FC = () => {
  const [isDetailPinned, setIsDetailPinned] = useState(false);

  useBodyBgColor(GithubProjectBgColorClass);
  useGitHubProjectCommands();

  return (
    <>
      <div
        className={clsx(
          "grid h-[100dvh] w-[100dvw] grid-rows-[var(--header-height)_minmax(0,1fr)] overflow-hidden text-neutral-100",
          GithubProjectBgColorClass,
        )}
        style={{
          colorScheme: "dark",
          ["--header-height" as string]: appHeaderHeightPx,
        }}
      >
        <AppHeader />
        <PanelGroup direction="horizontal" autoSaveId="persistence">
          <Panel defaultSize={100}>
            <div className="grid h-full grid-rows-[min-content,1fr] overflow-auto">
              <div className="flex h-[48px] w-full items-center justify-between gap-4 px-8">
                <div className="text-nowrap text-lg font-bold">zero-one-ui</div>
                <div className="flex items-center gap-2">
                  <button className="h-5 text-nowrap rounded-full bg-neutral-700 px-2 text-xs font-bold text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200">
                    Add status update
                  </button>
                  <div className="flex items-center">
                    <Tooltip label="Insight">
                      <ButtonGroupItem position="left" icon={LineChartIcon} />
                    </Tooltip>
                    <Tooltip label="Project details">
                      <ButtonGroupItem icon={PanelRightOpenIcon} />
                    </Tooltip>
                    <ProjectMenuTrigger>
                      <ButtonGroupItem
                        position="right"
                        icon={MoreHorizontalIcon}
                      />
                    </ProjectMenuTrigger>
                  </div>
                </div>
              </div>
              <Suspense>
                <ViewTabsPage />
              </Suspense>
            </div>
          </Panel>
          <Suspense>
            <TaskDetailPanel
              isPinned={isDetailPinned}
              onTogglePin={() => setIsDetailPinned((s) => !s)}
            />
          </Suspense>
        </PanelGroup>
      </div>
      <Toaster />
    </>
  );
};
export default GitHubProjectPage;
