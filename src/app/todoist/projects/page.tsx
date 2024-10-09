"use client";

import { z } from "zod";
import { AppLayout } from "../_components/app-layout/app-layout";
import { useSearchParams } from "next/navigation";
import { useProject } from "../_features/project/use-project";
import { Tooltip, TooltipDelayGroup } from "../_components/tooltip";
import { IconButton } from "../_components/icon-button";
import { PiChatLight } from "@react-icons/all-files/pi/PiChatLight";
import { PiDotsThreeOutlineLight } from "@react-icons/all-files/pi/PiDotsThreeOutlineLight";
import { PiSlidersHorizontalLight } from "@react-icons/all-files/pi/PiSlidersHorizontalLight";
import { PiUserPlusLight } from "@react-icons/all-files/pi/PiUserPlusLight";
import { ButtonLink } from "../_components/button";
import { Routes } from "../routes";
import { AppLayoutTasksContent } from "../_components/app-layout/tasks-content";

const ProjectPage: React.FC = () => {
  const projectId = z.string().parse(useSearchParams().get("id"));
  const { data: project } = useProject(projectId);

  return (
    <AppLayout
      title={project?.label ?? ""}
      leftHeader={
        <ButtonLink href={Routes.projectList()} size="sm" color="transparent">
          マイプロジェクト
        </ButtonLink>
      }
      rightHeader={
        <div className="flex items-center gap-1">
          <TooltipDelayGroup>
            <Tooltip label="プロジェクトを共有" keys={["Shift", "S"]}>
              <IconButton icon={PiUserPlusLight} label="共有" />
            </Tooltip>
            <Tooltip label="オプションメニューを表示">
              <IconButton icon={PiSlidersHorizontalLight} label="表示" />
            </Tooltip>
            <Tooltip label="コメント">
              <IconButton icon={PiChatLight} />
            </Tooltip>
            <Tooltip label="その他のアクション" keys={["W"]}>
              <IconButton icon={PiDotsThreeOutlineLight} />
            </Tooltip>
          </TooltipDelayGroup>
        </div>
      }
    >
      {project ? (
        <AppLayoutTasksContent
          tasks={project.tasks}
          taskboxId={project.taskboxId}
        />
      ) : null}
    </AppLayout>
  );
};

export default ProjectPage;
