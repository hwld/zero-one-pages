import {
  dragProjectEnd,
  dragProjectStart,
  getProjectPositionChanges,
  moveProject,
  ProjectMap,
  ProjectNode,
  toProjectMap,
  updateProjectDepth,
} from "../logic/project";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useProjects } from "../use-projects";
import { useChangeProjectPosition } from "../use-change-project-position";
import { ProjectExpansionMap } from "../logic/expansion-map";

type UseDragMyProjectNavLinkParams = {
  projectExpansionMap: ProjectExpansionMap;
  setProjectExpansionMap: Dispatch<SetStateAction<ProjectExpansionMap>>;
  updateProjectsCache: ReturnType<typeof useProjects>["updateProjectsCache"];
};

export const useDragMyProjectNavLink = ({
  projectExpansionMap,
  setProjectExpansionMap,
  updateProjectsCache,
}: UseDragMyProjectNavLinkParams) => {
  const changeProjectPosition = useChangeProjectPosition();
  const [draggingProjectId, setDraggingProjectId] = useState<null | string>(
    null,
  );
  const dragStartProjectMap = useRef<ProjectMap>(new Map());

  const dragStartInfo = useRef({ x: 0, depth: 0 });
  const removedDescendantsRef = useRef<ProjectNode[]>([]);

  const handleDragStart = (e: React.DragEvent, project: ProjectNode) => {
    dragStartInfo.current = { x: e.clientX, depth: project.depth };

    updateProjectsCache((projects) => {
      dragStartProjectMap.current = toProjectMap(projects);
      const { results, removedDescendantNodes } = dragProjectStart(
        projects,
        projectExpansionMap,
        project.id,
      );
      removedDescendantsRef.current = removedDescendantNodes;

      return results;
    });
    setDraggingProjectId(project.id);
  };

  const handleMoveProjects = (draggingId: string, dragOverId: string) => {
    updateProjectsCache((projects) => {
      return moveProject(projects, projectExpansionMap, draggingId, dragOverId);
    });
  };

  const handleChangeDepth = (e: MouseEvent, projectId: string) => {
    const newDepth =
      dragStartInfo.current.depth +
      Math.floor((e.clientX - dragStartInfo.current.x) / 16);

    updateProjectsCache((projects) => {
      return updateProjectDepth(
        projects,
        projectExpansionMap,
        projectId,
        newDepth,
      );
    });
  };

  useEffect(() => {
    const handleDragEnd = () => {
      if (!draggingProjectId) {
        return;
      }

      updateProjectsCache((projects) => {
        const [updatedProjects, expansionMap] = dragProjectEnd(
          projects,
          projectExpansionMap,
          draggingProjectId,
          removedDescendantsRef.current,
        );
        setProjectExpansionMap(expansionMap);

        const updatedMap = toProjectMap(updatedProjects);
        const projectPositionChanges = getProjectPositionChanges(
          dragStartProjectMap.current,
          updatedMap,
        );
        changeProjectPosition.mutate(projectPositionChanges);

        return updatedProjects;
      });

      setDraggingProjectId(null);
    };

    document.addEventListener("pointerup", handleDragEnd);
    return () => {
      document.removeEventListener("pointerup", handleDragEnd);
    };
  }, [
    changeProjectPosition,
    draggingProjectId,
    projectExpansionMap,
    setProjectExpansionMap,
    updateProjectsCache,
  ]);

  return {
    handleDragStart,
    handleMoveProjects,
    handleChangeDepth,
    draggingProjectId,
  };
};
