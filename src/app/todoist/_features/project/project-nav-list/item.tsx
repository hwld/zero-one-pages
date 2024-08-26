import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { useState, useMemo } from "react";
import {
  SidebarListButton,
  SidebarListLink,
} from "../../../_components/sidebar/item";
import { ProjectNavItemMenu } from "./item-menu";
import { IconButton, TreeToggleIconButton } from "./icon-button";
import { ProjectNode } from "../logic/project";
import { Routes } from "../../../routes";
import { ProjectDeleteDialog } from "../project-delete-dialog";
import { ProjectUpdateDialog } from "../project-update-dialog";
import { ProjectCreateDialog } from "../project-create-dialog";
import { useDragProjectNavItem } from "./use-drag";
import { useDelayedState } from "../../../_hooks/use-delayed-state";

type ProjectListItemProps = {
  currentRoute: string;
  project: ProjectNode;
  expanded: boolean;
  onChangeExpanded: (id: string, expanded: boolean) => void;
};

export const ProjectNavItem: React.FC<ProjectListItemProps> = ({
  currentRoute,
  project,
  expanded,
  onChangeExpanded,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateBeforeDialogOpen, setIsCreateBeforeDialogOpen] =
    useState(false);
  const [isCreateAfterDialogOpen, setIsCreateAfterDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { itemRef, draggingProjectId, handleDragStart } = useDragProjectNavItem(
    project.id,
  );
  const isDragging = draggingProjectId === project.id;

  // Link -> IconButtonの順にfocusを当てるとき、LinkのonBlurですぐにhoverをfalseにすると、
  // その時点IconButtonが消えてしまうので、hoverをfalseにするのを次のイベントループまで遅延させて
  // IconButtonにフォーカスと当てられるようにする
  const [isFocus, setFocus] = useDelayedState(false);

  const rightNode = useMemo(() => {
    if (!isFocus && !isMenuOpen) {
      return project.todos > 0 ? project.todos : undefined;
    }

    return (
      <ProjectNavItemMenu
        onOpenUpdateDialog={() => setIsUpdateDialogOpen(true)}
        onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
        onOpenCreateBeforeDialog={() => setIsCreateBeforeDialogOpen(true)}
        onOpenCreateAfterDialog={() => setIsCreateAfterDialogOpen(true)}
        onOpenChange={(open) => {
          if (!open) {
            // Menuを閉じたときにIconBUttonにfocusを戻す時間を確保する
            window.setTimeout(() => {
              setIsMenuOpen(false);
            }, 300);
          }
          setIsMenuOpen(true);
        }}
        trigger={
          <IconButton
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          >
            <PiDotsThreeBold className="size-6" />
          </IconButton>
        }
      />
    );
  }, [isFocus, isMenuOpen, project.todos, setFocus]);

  return (
    <>
      {isDragging ? (
        <SidebarListButton
          icon={PiHashLight}
          isDragging={isDragging}
          depth={project.depth}
        >
          {project.label}
        </SidebarListButton>
      ) : (
        <SidebarListLink
          ref={itemRef}
          href={Routes.project(project.id)}
          currentRoute={currentRoute}
          icon={PiHashLight}
          onPointerEnter={() => setFocus(true)}
          onPointerLeave={() => {
            setFocus(false);
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          isDragging={isDragging}
          isAnyDragging={!!draggingProjectId}
          onDragStart={(e) => {
            handleDragStart(e, project);
          }}
          right={
            <div className="flex items-center gap-1">
              <div className="grid size-6 place-items-center">{rightNode}</div>
              {project.descendantsProjectCount ? (
                <TreeToggleIconButton
                  isOpen={expanded}
                  onOpenChange={(open) => onChangeExpanded(project.id, open)}
                />
              ) : null}
            </div>
          }
          depth={project.depth}
        >
          {project.label}
        </SidebarListLink>
      )}
      <ProjectDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        project={project}
      />
      <ProjectUpdateDialog
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        project={project}
      />
      <ProjectCreateDialog
        isOpen={isCreateBeforeDialogOpen}
        onOpenChange={setIsCreateBeforeDialogOpen}
        createType="before"
        referenceProjectId={project.id}
      />
      <ProjectCreateDialog
        isOpen={isCreateAfterDialogOpen}
        onOpenChange={setIsCreateAfterDialogOpen}
        createType="after"
        referenceProjectId={project.id}
      />
    </>
  );
};
