"use client";
import {
  LineChartIcon,
  MoreHorizontalIcon,
  PanelRightOpenIcon,
  PlusIcon,
} from "lucide-react";
import React from "react";
import { Tooltip } from "./_components/tooltip";
import { AppHeader } from "./_components/app-header/app-header";
import { useView } from "./_queries/useView";
import { ButtonGroupItem } from "./_components/button-group-item";
import { ProjectMenuTrigger } from "./_components/project-menu-trigger";
import { ViewTab } from "./_components/view-tab";
import { SlicerPanel } from "./_components/slicer-panel/slicer-panel";
import { MainPanel } from "./_components/main-panel";
import { VIEW_ID } from "./consts";

const GitHubProjectPage: React.FC = () => {
  const { data: view } = useView(VIEW_ID);

  return (
    <div
      className="grid h-[100dvh] w-[100dvw] grid-rows-[64px_48px_minmax(0,1fr)] overflow-hidden bg-neutral-900 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
      <AppHeader />
      <div className="flex items-center justify-between px-8">
        <div className="text-lg font-bold">zero-one-ui</div>
        <div className="flex items-center gap-2">
          <button className="h-5 rounded-full bg-neutral-700 px-2 text-xs font-bold text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200">
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
              <ButtonGroupItem position="right" icon={MoreHorizontalIcon} />
            </ProjectMenuTrigger>
          </div>
        </div>
      </div>
      <div className="grid grid-rows-[min-content_minmax(0,1fr)]">
        <div className="flex gap-1 border-b border-neutral-600 px-8">
          <ViewTab active>Kanban1</ViewTab>
          <ViewTab>Kanban2</ViewTab>
          <ViewTab icon={PlusIcon}>New view</ViewTab>
        </div>
        <div className="flex w-[100dvw] bg-neutral-800">
          <SlicerPanel columns={view?.columns ?? []} />
          {view && <MainPanel view={view} />}
        </div>
      </div>
    </div>
  );
};
export default GitHubProjectPage;
