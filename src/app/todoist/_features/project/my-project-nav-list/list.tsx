import clsx from "clsx";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiBrowsersLight } from "@react-icons/all-files/pi/PiBrowsersLight";
import { PiSpinnerGap } from "@react-icons/all-files/pi/PiSpinnerGap";
import { PiWarningCircle } from "@react-icons/all-files/pi/PiWarningCircle";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes } from "../../../routes";
import Link from "next/link";
import { Menu } from "../../../_components/menu/menu";
import { MenuButtonItem } from "../../../_components/menu/item";
import { Icon, IconButton, TreeToggleIconButton } from "./icon-button";
import { useDragMyProjectNavLink } from "./use-drag";
import { ProjectExpansionMap } from "../logic/expansion-map";
import { toProjectNodes } from "../logic/project";
import { useProjects } from "../use-projects";
import { MyProjectNavLink } from "./item";
import { Button } from "@/app/todoist/_components/button";

type Props = {
  isHeaderActive?: boolean;
  currentRoute: string;
};

export const MyProjectNavList: React.FC<Props> = ({
  isHeaderActive,
  currentRoute,
}) => {
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
    <div>
      <div
        className={clsx(
          "group/sidebar flex h-9 w-full items-center justify-between rounded transition-colors",
          isHeaderActive ? "bg-rose-100" : "hover:bg-black/5",
        )}
      >
        <Link
          href={Routes.myProjectList()}
          className={clsx(
            "w-full py-2 pl-2 text-start font-bold",
            isHeaderActive ? "text-rose-700" : "text-stone-500",
          )}
        >
          マイプロジェクト
        </Link>
        <div
          className={clsx(
            "group flex h-full items-center gap-1 pr-2",
            projectsStatus === "pending"
              ? "opacity-100"
              : "opacity-0 focus-within:opacity-100 group-hover/sidebar:opacity-100 has-[*[data-open]]:opacity-100",
          )}
        >
          <Menu
            trigger={
              <IconButton>
                <Icon icon={PiPlusLight} />
              </IconButton>
            }
          >
            <MenuButtonItem
              icon={PiHashLight}
              label="プロジェクトを追加"
              description="タスクを計画&アサイン"
            />
            <MenuButtonItem
              icon={PiBrowsersLight}
              label="テンプレートを見る"
              description="プロジェクトテンプレートで始める"
            />
          </Menu>
          {projectsStatus === "pending" ? (
            <PiSpinnerGap className="animate-spin" />
          ) : projectNodes.length ? (
            <TreeToggleIconButton isOpen={isOpen} onOpenChange={setIsOpen} />
          ) : null}
        </div>
      </div>
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
                    {projectNode.visible ||
                    draggingProjectId === projectNode.id ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <MyProjectNavLink
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
