import { ProjectNode } from "@/app/todoist/project";
import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { useState, useRef, useMemo, useEffect } from "react";
import { SidebarListButton, SidebarListLink } from "../item";
import { MyProjectMenu } from "./project-menu";
import { Routes } from "@/app/todoist/routes";
import { IconButton, TreeToggleIconButton } from "./icon-button";

type MyProjectListItemProps = {
  currentRoute: string;
  project: ProjectNode;
  onChangeExpanded: (id: string, expanded: boolean) => void;
  draggingProjectId: null | string;
  onDrag: (projectId: string) => void;
  onMoveProjects: (fromId: string, toId: string) => void;
  onChangeProjectDepth: (projectId: string, depthChange: number) => void;
};

export const MyProjectListItem: React.FC<MyProjectListItemProps> = ({
  currentRoute,
  project,
  onChangeExpanded,
  draggingProjectId,
  onDrag,
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
      <MyProjectMenu
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
  const dragStartInfo = useRef({ x: 0, depth: 0 });

  useEffect(() => {
    const handleChangeDepth = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const newDepth =
        dragStartInfo.current.depth +
        Math.floor((e.clientX - dragStartInfo.current.x) / 16);

      onChangeProjectDepth(project.id, newDepth);
    };

    document.addEventListener("pointermove", handleChangeDepth);
    return () => {
      document.removeEventListener("pointermove", handleChangeDepth);
    };
  }, [isDragging, onChangeProjectDepth, project.depth, project.id]);

  // リストの外側のドラッグも処理できるように、poitnermoveイベントをハンドリングする
  useEffect(() => {
    const handleDragOver = (e: MouseEvent) => {
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

    document.addEventListener("pointermove", handleDragOver);
    return () => {
      document.removeEventListener("pointermove", handleDragOver);
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
            dragStartInfo.current = { x: e.clientX, depth: project.depth };
            onDrag(project.id);
          }}
          right={
            <div className="flex items-center gap-1">
              <div className="grid size-6 place-items-center">{rightNode}</div>
              {project.subProjectCount ? (
                <TreeToggleIconButton
                  isOpen={project.expanded}
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
