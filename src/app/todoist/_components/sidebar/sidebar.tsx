"use client";
import React, { Suspense, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Resizable } from "re-resizable";
import { useRef, useState } from "react";
import { PiBellSimple } from "@react-icons/all-files/pi/PiBellSimple";
import { PiSidebarSimple } from "@react-icons/all-files/pi/PiSidebarSimple";
import { MyProjectNavList } from "../../_features/project/my-project-nav-list/list";
import { Routes } from "../../routes";
import { usePathname, useSearchParams } from "next/navigation";
import { Tooltip, TooltipDelayGroup } from "../tooltip";
import { toProjectNodes } from "../../_features/project/logic/project";
import { UserMenuTrigger } from "./user-menu";
import { SidebarNavList } from "./nav-list";
import { SidebarIconButton } from "./icon-button";
import { MyProjectNavLink } from "../../_features/project/my-project-nav-list/item";
import { useProjects } from "../../_features/project/use-projects";
import { useDragMyProjectNavLink } from "../../_features/project/my-project-nav-list/use-drag";
import { ProjectExpansionMap } from "../../_features/project/logic/expansion-map";

export const Sidebar: React.FC = () => {
  const resizableRef = useRef<Resizable>(null);

  const [isOpen, setIsOpen] = useState(true);
  const marginLeft = useMemo(() => {
    if (isOpen) {
      return 0;
    }

    const barWidth = resizableRef.current?.size.width;
    return barWidth ? -barWidth : 0;
  }, [isOpen]);

  const handleClass = "flex justify-center group";
  const handle = (
    <div className="h-full w-1 transition-colors group-hover:bg-black/10 group-active:bg-black/20" />
  );

  return (
    <TooltipDelayGroup>
      <motion.div className="flex" animate={{ marginLeft }}>
        <Resizable
          ref={resizableRef}
          className="bg-stone-200/40"
          handleClasses={{ right: handleClass }}
          handleComponent={{ right: handle }}
          enable={{ right: true }}
          minWidth={210}
          defaultSize={{ width: 250 }}
          maxWidth={420}
        >
          <Suspense>
            <SidebarContent isOpen={isOpen} onChangeOpen={setIsOpen} />
          </Suspense>
        </Resizable>
      </motion.div>
    </TooltipDelayGroup>
  );
};

type ContentProps = { isOpen: boolean; onChangeOpen: (open: boolean) => void };

const SidebarContent: React.FC<ContentProps> = ({ isOpen, onChangeOpen }) => {
  const paths = usePathname();
  const searchParams = useSearchParams();

  const currentRoute = useMemo(() => {
    if (paths === Routes.myProject()) {
      const id = searchParams.get("id");
      if (id) {
        return Routes.myProject(id);
      }
    }

    return paths;
  }, [paths, searchParams]);

  // TODO:
  const { data: projects = [], updateProjectsCache } = useProjects();
  const [projectExpansionMap, setProjectExpansionMap] = useState(
    new ProjectExpansionMap(),
  );
  const projectNodes = toProjectNodes(projects, projectExpansionMap);

  const {
    handleDragStart,
    handleMoveProjects,
    handleChangeDepth,
    draggingProjectId,
  } = useDragMyProjectNavLink({
    projectExpansionMap,
    setProjectExpansionMap,
    updateProjectsCache,
  });

  const handleChangeExpanded = (projectId: string, newExpanded: boolean) => {
    setProjectExpansionMap((m) => {
      return new ProjectExpansionMap(m).toggle(projectId, newExpanded);
    });
  };

  return (
    <div className="group/sidebar relative flex size-full flex-col gap-3 p-3">
      <div className="flex h-min w-full justify-between">
        <UserMenuTrigger />
        <div className="flex items-center gap-1">
          <Tooltip label="通知を開く" keys={["O", "N"]}>
            <SidebarIconButton icon={PiBellSimple} />
          </Tooltip>
          <Tooltip label="サイドバーを閉じる" keys={["M"]}>
            <SidebarIconButton
              icon={PiSidebarSimple}
              onClick={() => {
                onChangeOpen(false);
              }}
              style={{ opacity: isOpen ? 1 : 0 }}
            />
          </Tooltip>
        </div>
      </div>
      <AnimatePresence>
        {isOpen ? null : (
          <motion.div
            className="absolute left-full ml-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Tooltip
              label="サイドバーを開く"
              keys={["M"]}
              placement="bottom-start"
            >
              <SidebarIconButton
                icon={PiSidebarSimple}
                onClick={() => {
                  onChangeOpen(true);
                }}
              />
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      <SidebarNavList currentRoute={currentRoute} />

      <MyProjectNavList
        isHeaderActive={currentRoute === Routes.myProjectList()}
      >
        {projectNodes.map((projectNode) => {
          return (
            <AnimatePresence key={projectNode.id}>
              {projectNode.visible || draggingProjectId === projectNode.id ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <MyProjectNavLink
                    currentRoute={currentRoute}
                    project={projectNode}
                    expanded={projectExpansionMap.isExpanded(projectNode.id)}
                    onChangeExpanded={handleChangeExpanded}
                    draggingProjectId={draggingProjectId}
                    onDragStart={handleDragStart}
                    onMoveProjects={handleMoveProjects}
                    onChangeProjectDepth={handleChangeDepth}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          );
        })}
      </MyProjectNavList>
    </div>
  );
};
