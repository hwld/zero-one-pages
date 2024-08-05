// subProjectsが空のときはexpandedがfalseになっている必要がある
export type Project = {
  id: string;
  label: string;
  todos: number;
  subProjects: Project[];
  expanded: boolean;
};

export type ProjectNode = Omit<Project, "subProjects"> & {
  depth: number;
  visible: boolean;
  isDragging: boolean;
  subProjectCount: number;
};

const findProject = (projects: Project[], id: string): Project | undefined => {
  for (const project of projects) {
    if (project.id === id) {
      return project;
    }

    const found = findProject(project.subProjects, id);
    if (found) {
      return found;
    }
  }
  return undefined;
};

export const updatedProjects = (
  projects: Project[],
  id: string,
  data: Partial<Omit<Project, "id" | "subProjects">>,
): Project[] => {
  const nodes = toProjectNodes(projects);

  const newNodes = nodes.map((node): ProjectNode => {
    if (node.id === id) {
      return { ...node, ...data };
    }
    return node;
  });

  return toProjects(newNodes);
};

export const toProjectNodes = (
  projects: Project[],
  depth: number = 0,
  parentVisible: boolean = true,
): ProjectNode[] => {
  return projects.flatMap((project): ProjectNode[] => {
    const node: ProjectNode = {
      ...project,
      depth,
      visible: parentVisible,
      subProjectCount: project.subProjects.length,
      isDragging: false,
    };

    return [
      node,
      ...toProjectNodes(
        project.subProjects,
        depth + 1,
        parentVisible && project.expanded,
      ),
    ];
  });
};

export const toProjects = (nodes: ProjectNode[]): Project[] => {
  const buildSubProjects = (
    nodes: ProjectNode[],
    depth: number,
    index: number,
  ): [Project[], number] => {
    const result: Project[] = [];

    while (index < nodes.length && nodes[index].depth === depth) {
      const node = nodes[index];
      const [subProjects, newIndex] = buildSubProjects(
        nodes,
        depth + 1,
        index + 1,
      );

      result.push({
        id: node.id,
        label: node.label,
        todos: node.todos,
        expanded: node.expanded,
        subProjects: subProjects,
      });

      index = newIndex;
    }

    return [result, index];
  };

  return buildSubProjects(nodes, 0, 0)[0];
};

const countProjectDescendants = (project: Project): number => {
  return project.subProjects.reduce((acc, subProject) => {
    return acc + 1 + countProjectDescendants(subProject);
  }, 0);
};

// TODO: fromに含まれるサブプロジェクトがtoIdに来ることを想定していない
// その制限を反映させたい
export const moveProject = (
  projects: Project[],
  fromId: string,
  toId: string,
): Project[] => {
  if (fromId === toId) {
    return projects;
  }

  const nodes = toProjectNodes(projects);

  const fromIndex = nodes.findIndex((p) => p.id === fromId);
  let toIndex = nodes.findIndex((p) => p.id === toId);
  const toNode = nodes[toIndex];

  const newNodes = [...nodes];

  if (fromIndex < toIndex && toNode.subProjectCount && !toNode.expanded) {
    // 前から後の移動で、移動対象のプロジェクトにsubProjectsが存在し、展開されていない場合には
    // 移動対象のプロジェクトの子孫プロジェクトの数だけindexをずらす
    const toProject = findProject(projects, toNode.id);
    if (!toProject) {
      throw new Error("移動対象のプロジェクトが存在しません");
    }

    toIndex = toIndex + countProjectDescendants(toProject);
  }

  newNodes.splice(toIndex, 0, newNodes.splice(fromIndex, 1)[0]);

  // 移動したプロジェクト (from)
  const moved = newNodes[toIndex];

  if (fromIndex < toIndex && toNode.subProjectCount && toNode.expanded) {
    moved.depth = toNode.depth + 1;
  } else {
    moved.depth = toNode.depth;
  }

  return toProjects(newNodes);
};

export const updateProjectDepth = (
  projects: Project[],
  projectId: string,
  newDepth: number,
): Project[] => {
  const nodes = toProjectNodes(projects);

  const targetIndex = nodes.findIndex((p) => p.id === projectId);
  if (targetIndex === -1) {
    throw new Error(`変更対象のプロジェクトが存在しない: ${projectId}`);
  }

  const targetDepth = nodes[targetIndex].depth;
  // 直近でvisibleがtrueのプロジェクトのdepth
  const prevDepth =
    nodes.slice(0, targetIndex).findLast((p) => p.visible === true)?.depth ??
    -1;
  const nextDepth = nodes[targetIndex + 1]?.depth ?? 0;

  // 前の要素のdepth+1以上大きくはできない
  if (newDepth > prevDepth + 1) {
    newDepth = prevDepth + 1;
  }

  // 次の要素とdepthが等しい場合、次の要素よりも小さくできない
  if (targetDepth === nextDepth && newDepth < nextDepth) {
    newDepth = nextDepth;
  }

  if (newDepth < 0) {
    newDepth = 0;
  }

  const newNodes = [...nodes];
  newNodes[targetIndex].depth = newDepth;

  // targetが子でtargetの親プロジェクトのexpandがfalseであればtrueにする
  if (newDepth > 0) {
    const parent = newNodes
      .slice(0, targetIndex)
      .findLast((p) => p.depth === newDepth - 1);
    if (!parent) {
      throw new Error(`親プロジェクトが存在しない`);
    }

    parent.expanded = true;
  }

  return toProjects(newNodes);
};

export const dragProjectStart = (
  projects: Project[],
  id: string,
): { results: Project[]; removedDescendantNodes: ProjectNode[] } => {
  const nodes = toProjectNodes(projects);

  const targetIndex = nodes.findIndex((p) => p.id === id);
  const targetNode = nodes[targetIndex];
  if (!targetNode) {
    throw new Error(`プロジェクトが存在しない: ${id}`);
  }

  const targetProject = findProject(projects, id);
  if (!targetProject) {
    throw new Error(`プロジェクトが存在しない: ${id}`);
  }

  // ドラッグする要素の子孫をすべて削除する
  const descendantCount = countProjectDescendants(targetProject);
  const descendantsStartIndex = targetIndex + 1;
  const descendantsEndIndex = targetIndex + descendantCount + 1;
  const descendants = nodes.slice(descendantsStartIndex, descendantsEndIndex);

  const newNodes = [
    ...nodes.slice(0, descendantsStartIndex),
    ...nodes.slice(descendantsEndIndex),
  ];

  newNodes[targetIndex].isDragging = true;

  return { results: toProjects(newNodes), removedDescendantNodes: descendants };
};

export const dragProjectEnd = (
  projects: Project[],
  id: string,
  removedDescendants: ProjectNode[],
): Project[] => {
  const nodes = toProjectNodes(projects);

  const newNodes = nodes.flatMap((node) => {
    if (node.id === id) {
      return [
        { ...node, isDragging: false },
        ...removedDescendants.map((descendant) => {
          const parentDepth = node.depth;
          const descendantRootDepth = removedDescendants[0].depth;

          return {
            ...descendant,
            depth: descendant.depth - descendantRootDepth + parentDepth + 1,
          };
        }),
      ];
    }
    return node;
  });

  return toProjects(newNodes);
};
