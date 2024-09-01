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
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useProjects } from "../use-projects";
import { useChangeProjectPosition } from "../use-change-project-position";
import { ProjectExpansionMap } from "../logic/expansion-map";

type UseDragProjectListParams = {
  projectExpansionMap: ProjectExpansionMap;
  setProjectExpansionMap: Dispatch<SetStateAction<ProjectExpansionMap>>;
  updateProjectsCache: ReturnType<typeof useProjects>["updateProjectsCache"];
};

export type DragProjectListState = {
  draggingProjectId: string | null;
  handleDragStart: (e: React.DragEvent, project: ProjectNode) => void;
  handleMoveProjects: (draggingId: string, dragOverId: string) => void;
  handleChangeDepth: (e: MouseEvent, projectId: string) => void;
};

export const useDragProjectList = ({
  projectExpansionMap,
  setProjectExpansionMap,
  updateProjectsCache,
}: UseDragProjectListParams): DragProjectListState => {
  const changeProjectPosition = useChangeProjectPosition();
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(
    null,
  );
  const dragStartProjectMap = useRef<ProjectMap>(new Map());

  const dragStartInfo = useRef({ x: 0, depth: 0 });
  const removedDescendantsRef = useRef<ProjectNode[]>([]);

  const handleDragStart: DragProjectListState["handleDragStart"] = useCallback(
    (e, project) => {
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
    },
    [projectExpansionMap, setDraggingProjectId, updateProjectsCache],
  );

  const handleMoveProjects: DragProjectListState["handleMoveProjects"] =
    useCallback(
      (draggingId, dragOverId) => {
        updateProjectsCache((projects) => {
          return moveProject(
            projects,
            projectExpansionMap,
            draggingId,
            dragOverId,
          );
        });
      },
      [projectExpansionMap, updateProjectsCache],
    );

  const handleChangeDepth: DragProjectListState["handleChangeDepth"] =
    useCallback(
      (e, projectId) => {
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
      },
      [projectExpansionMap, updateProjectsCache],
    );

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
    setDraggingProjectId,
    setProjectExpansionMap,
    updateProjectsCache,
  ]);

  return {
    draggingProjectId,
    handleDragStart,
    handleMoveProjects,
    handleChangeDepth,
  };
};

export const useDragProject = (
  projectId: string,
  state: DragProjectListState,
) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const {
    handleMoveProjects,
    handleChangeDepth,
    draggingProjectId,
    handleDragStart,
  } = state;

  const isDragging = projectId === draggingProjectId;

  useEffect(() => {
    const changeDepth = (e: MouseEvent) => {
      if (isDragging) {
        handleChangeDepth(e, projectId);
      }
    };

    document.addEventListener("pointermove", changeDepth);
    return () => {
      document.removeEventListener("pointermove", changeDepth);
    };
  }, [handleChangeDepth, isDragging, projectId]);

  useEffect(() => {
    const moveProject = (e: MouseEvent) => {
      const itemEl = itemRef.current;
      if (draggingProjectId == null || isDragging || !itemEl) {
        return;
      }

      const itemRect = itemEl.getBoundingClientRect();
      const isPointerOver =
        e.clientY <= itemRect.bottom && e.clientY >= itemRect.top;
      if (isPointerOver) {
        handleMoveProjects(draggingProjectId, projectId);
      }
    };

    document.addEventListener("pointermove", moveProject);
    return () => {
      document.removeEventListener("pointermove", moveProject);
    };
  }, [draggingProjectId, handleMoveProjects, isDragging, projectId]);

  return { itemRef, draggingProjectId, handleDragStart };
};
