import { PiWarningCircle } from "@react-icons/all-files/pi/PiWarningCircle";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDragProjectNavItem } from "./use-drag";
import { ProjectExpansionMap } from "../logic/expansion-map";
import { toProjectNodes } from "../logic/project";
import { useProjects } from "../use-projects";
import { ProjectNavItem } from "./item";
import { Button } from "../../../_components/button";
import { ProjectNavListHeader } from "./header";
import { Routes } from "../../../routes";

type Props = {
  currentRoute: string;
};

export const ProjectNavList: React.FC<Props> = ({ currentRoute }) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
    data: projects = [],
    status: projectsStatus,
    refetch: refetchProjects,
    updateProjectsCache,
  } = useProjects();
  const [projectExpansionMap, setProjectExpansionMap] = useState(
    new ProjectExpansionMap(),
  );

  const projectNodes = toProjectNodes(projects, projectExpansionMap);

  const {
    handleDragStart,
    handleMoveProjects,
    handleChangeDepth,
    draggingProjectId,
  } = useDragProjectNavItem({
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
    <div>
      <ProjectNavListHeader
        active={currentRoute === Routes.projectList()}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isProjectPending={projectsStatus === "pending"}
        projectsCount={projects.length}
      />
      {projectsStatus === "error" ? (
        <div className="mt-1 flex gap-1 rounded border border-red-500 bg-red-50 p-2 text-xs">
          <PiWarningCircle className="size-5 shrink-0 text-red-500" />
          <div className="space-y-2">
            <div className="flex min-h-5 items-center font-bold text-red-700">
              プロジェクトを正しく読み込むことができませんでした
            </div>
            <Button size="sm" onClick={() => refetchProjects()}>
              再読み込み
            </Button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {isOpen ? (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1 }}
            >
              {projectNodes.map((projectNode) => {
                return (
                  <AnimatePresence key={projectNode.id}>
                    {projectNode.visible ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <ProjectNavItem
                          currentRoute={currentRoute}
                          project={projectNode}
                          expanded={projectExpansionMap.isExpanded(
                            projectNode.id,
                          )}
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
            </motion.ul>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
};
