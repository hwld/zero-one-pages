import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { useState, useRef, useMemo, useEffect } from "react";
import {
  SidebarListButton,
  SidebarListLink,
} from "../../../_components/sidebar/item";
import { MyProjectNavLinkMenu } from "./item-menu";
import { Routes } from "@/app/todoist/routes";
import { IconButton, TreeToggleIconButton } from "./icon-button";
import { ProjectNode } from "@/app/todoist/project";

type MyProjectListItemProps = {
  currentRoute: string;
  project: ProjectNode;
  expanded: boolean;
  onChangeExpanded: (id: string, expanded: boolean) => void;
  draggingProjectId: null | string;
  onDragStart: (event: React.DragEvent, project: ProjectNode) => void;
  onMoveProjects: (fromId: string, toId: string) => void;
  onChangeProjectDepth: (event: MouseEvent, projectId: string) => void;
};

export const MyProjectNavLink: React.FC<MyProjectListItemProps> = ({
  currentRoute,
  project,
  expanded,
  onChangeExpanded,
  draggingProjectId,
  onDragStart,
  onMoveProjects,
  onChangeProjectDepth,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const itemRef = useRef<HTMLLIElement>(null);

  const timer = useRef(0);

  // Link -> IconButtonの順にfocusを当てるとき、LinkのonBlurですぐにhoverをfalseにすると、
  // その時点IconButtonが消えてしまうので、hoverをfalseにするのを次のイベントループまで遅延させて
  // IconButtonにフォーカスと当てられるようにする
  const setFocus = (focus: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setIsFocus(focus);
    }, 0);
  };

  const rightNode = useMemo(() => {
    if (!isFocus && !isMenuOpen) {
      return project.todos > 0 ? project.todos : undefined;
    }

    return (
      <MyProjectNavLinkMenu
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
  }, [isFocus, isMenuOpen, project.todos]);

  const isDragging = draggingProjectId === project.id;

  useEffect(() => {
    const handleChangeDepth = (e: MouseEvent) => {
      if (isDragging) {
        onChangeProjectDepth(e, project.id);
      }
    };

    document.addEventListener("pointermove", handleChangeDepth);
    return () => {
      document.removeEventListener("pointermove", handleChangeDepth);
    };
  }, [isDragging, onChangeProjectDepth, project.depth, project.id]);

  // リストの外側のドラッグも処理できるように、poitnermoveイベントをハンドリングする
  useEffect(() => {
    const handleMoveProject = (e: MouseEvent) => {
      const itemEl = itemRef.current;
      if (draggingProjectId == null || isDragging || !itemEl) {
        return;
      }

      const itemRect = itemEl.getBoundingClientRect();
      const isPointerOver =
        e.clientY <= itemRect.bottom && e.clientY >= itemRect.top;
      if (isPointerOver) {
        onMoveProjects(draggingProjectId, project.id);
      }
    };

    document.addEventListener("pointermove", handleMoveProject);
    return () => {
      document.removeEventListener("pointermove", handleMoveProject);
    };
  }, [draggingProjectId, isDragging, onMoveProjects, project.id]);

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
          href={Routes.myProject(project.id)}
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
            onDragStart(e, project);
          }}
          right={
            <div className="flex items-center gap-1">
              <div className="grid size-6 place-items-center">{rightNode}</div>
              {project.subProjectCount ? (
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
    </>
  );
};
