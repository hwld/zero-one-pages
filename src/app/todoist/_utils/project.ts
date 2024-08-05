// subProjectsが空のときはexpandedがfalse担っている必要がある
export type Project = {
  id: string;
  label: string;
  todos: number;
  subProjects: Project[];
  expanded: boolean;
};

export type FlatProject = Omit<Project, "subProjects"> & {
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
  data: Partial<Omit<Project, "id">>,
) => {
  return projects.map((project): Project => {
    if (project.id === id) {
      return { ...project, ...data };
    } else if (project.subProjects.length > 0) {
      return {
        ...project,
        subProjects: updatedProjects(project.subProjects, id, data),
      };
    }

    return project;
  });
};

export const toFlatProjects = (
  projects: Project[],
  depth: number = 0,
  parentVisible: boolean = true,
): FlatProject[] => {
  return projects.flatMap((project): FlatProject[] => {
    const flat: FlatProject = {
      ...project,
      depth,
      visible: parentVisible,
      subProjectCount: project.subProjects.length,
      isDragging: false,
    };

    return [
      flat,
      ...toFlatProjects(
        project.subProjects,
        depth + 1,
        parentVisible && project.expanded,
      ),
    ];
  });
};

export const toProjects = (flats: FlatProject[]): Project[] => {
  const buildSubProjects = (
    flats: FlatProject[],
    depth: number,
    index: number,
  ): [Project[], number] => {
    const result: Project[] = [];

    while (index < flats.length && flats[index].depth === depth) {
      const flat = flats[index];
      const [subProjects, newIndex] = buildSubProjects(
        flats,
        depth + 1,
        index + 1,
      );

      result.push({
        id: flat.id,
        label: flat.label,
        todos: flat.todos,
        expanded: flat.expanded,
        subProjects: subProjects,
      });

      index = newIndex;
    }

    return [result, index];
  };

  return buildSubProjects(flats, 0, 0)[0];
};

const countProjectDescendants = (project: Project): number => {
  return project.subProjects.reduce((acc, subProject) => {
    return acc + 1 + countProjectDescendants(subProject);
  }, 0);
};

/**
 *   指定されたprojectsのなかのbaseProjectIdを持つ要素の一つ前にnewProjectを追加したProject[]を返す。
 *   projectsのexpandを考慮して、展開されているツリーの中での一つ前を計算する。
 */
export const insertedBefore = (
  projects: Project[],
  baseProjectId: string,
  newProject: Project,
): Project[] => {
  const flats = toFlatProjects(projects);

  const baseFlatProject = flats.find((n) => n.id === baseProjectId);
  if (!baseFlatProject) {
    throw new Error("プロジェクトが存在しないｓ");
  }
  const baseProjectIndex = flats.indexOf(baseFlatProject);
  if (baseProjectIndex === 0) {
    return [newProject, ...projects];
  }

  let prevProject: FlatProject = flats[0];
  for (let i = baseProjectIndex - 1; i >= 0; i--) {
    if (flats[i].visible === true) {
      prevProject = flats[i];
      break;
    }
  }

  const newFlat: FlatProject = {
    ...newProject,
    visible: true,
    depth: Math.max(baseFlatProject.depth, prevProject.depth),
    subProjectCount: newProject.subProjects.length,
    isDragging: false,
  };

  const newFlats = [...flats];
  newFlats.splice(baseProjectIndex, 0, newFlat);
  return toProjects(newFlats);
};

/**
 *  projectsのなかのbaseProjectIdを持つ要素の一つ後ろにnewProjectを追加したProject[]を返す。
 *  projectsのexpandを考慮して、展開されているツリーの中での一つ後ろを計算する。
 */
export const insertedAfter = (
  projects: Project[],
  baseProjectId: string,
  newProject: Project,
): Project[] => {
  const flats = toFlatProjects(projects);

  const baseFlatProject = flats.find((p) => p.id === baseProjectId);
  const baseProject = findProject(projects, baseProjectId);
  if (!baseFlatProject || !baseProject) {
    throw new Error(`プロジェクトが存在しない: ${baseProjectId}`);
  }

  const baseProjectIndex = flats.indexOf(baseFlatProject);
  const baseProjectDescendants = countProjectDescendants(baseProject);

  const insertIndex = baseProjectIndex + baseProjectDescendants + 1;

  const newFlat: FlatProject = {
    ...newProject,
    depth: baseFlatProject.depth,
    visible: true,
    subProjectCount: newProject.subProjects.length,
    isDragging: false,
  };

  const newFlats = [...flats];
  newFlats.splice(insertIndex, 0, newFlat);
  return toProjects(newFlats);
};

/**
 *  projectsのなかのbaseProjectIdを持つ要素のsubProjectsのなかにnewProjectを追加したProject[]を返す。
 */
export const insertedSubProject = (
  projects: Project[],
  baseProjectId: string,
  newProject: Project,
): Project[] => {
  const flats = toFlatProjects(projects);

  const baseFlatProject = flats.find((n) => n.id === baseProjectId);
  if (!baseFlatProject) {
    throw new Error("プロジェクトが存在しない");
  }
  const baseProjectIndex = flats.indexOf(baseFlatProject);

  const newFlatProject: Omit<FlatProject, "visible"> = {
    ...newProject,
    depth: baseFlatProject.depth + 1,
    subProjectCount: newProject.subProjects.length,
    isDragging: false,
  };
  const newFlats = [...flats];

  if (baseFlatProject.expanded) {
    // 展開されていれば、baseProjectの後ろに追加する
    newFlats.splice(baseProjectIndex + 1, 0, {
      ...newFlatProject,
      visible: true,
    });
  } else {
    // 展開されていなければ、subProjectの一番最後に追加する
    const subProjects = baseFlatProject.subProjectCount;
    newFlats.splice(baseProjectIndex + subProjects + 1, 0, {
      ...newFlatProject,
      visible: subProjects === 0,
    });
  }

  return toProjects(newFlats);
};

// TODO: fromに含まれるサブプロジェクトがtoIdに来ることを想定していない
// その制限を反映させたい
export const moveProject = (
  projects: FlatProject[],
  fromId: string,
  toId: string,
): FlatProject[] => {
  if (fromId === toId) {
    return projects;
  }

  const fromIndex = projects.findIndex((p) => p.id === fromId);
  const toIndex = projects.findIndex((p) => p.id === toId);
  const toProject = projects[toIndex];

  const newProjects = [...projects];
  newProjects.splice(toIndex, 0, newProjects.splice(fromIndex, 1)[0]);

  // 移動したプロジェクト (from)
  const moved = newProjects[toIndex];

  if (fromIndex < toIndex && toProject.subProjectCount && toProject.expanded) {
    moved.depth = toProject.depth + 1;
  } else {
    moved.depth = toProject.depth;
  }

  return toFlatProjects(toProjects(newProjects.flat()));
};

export const changeDepth = (
  projects: FlatProject[],
  projectId: string,
  newDepth: number,
): FlatProject[] => {
  const targetIndex = projects.findIndex((p) => p.id === projectId);
  if (targetIndex === -1) {
    throw new Error(`変更対象のプロジェクトが存在しない: ${projectId}`);
  }

  const targetDepth = projects[targetIndex].depth;
  // 直近でvisibleがtrueのプロジェクトのdepth
  const prevDepth =
    projects.slice(0, targetIndex).findLast((p) => p.visible === true)?.depth ??
    -1;
  const nextDepth = projects[targetIndex + 1]?.depth ?? 0;

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

  const newProjects = [...projects];
  newProjects[targetIndex].depth = newDepth;

  // targetが子でtargetの親プロジェクトのexpandがfalseであればtrueにする
  if (newDepth > 0) {
    const parent = newProjects
      .slice(0, targetIndex)
      .findLast((p) => p.depth === newDepth - 1);
    if (!parent) {
      throw new Error(`親プロジェクトが存在しない`);
    }

    if (parent.expanded === false) {
      parent.expanded = true;
    }
  }

  return newProjects;
};

export const dragStart = (
  projects: FlatProject[],
  id: string,
): { results: FlatProject[]; removedDescendants: FlatProject[] } => {
  const targetIndex = projects.findIndex((p) => p.id === id);
  const target = projects[targetIndex];
  if (!target) {
    throw new Error(`プロジェクトが存在しない: ${id}`);
  }

  const targetProject = findProject(toProjects(projects), id);
  if (!targetProject) {
    throw new Error(`プロジェクトが存在しない: ${id}`);
  }

  // ドラッグする要素の子孫をすべて削除する
  const descendantCount = countProjectDescendants(targetProject);
  const descendantsStartIndex = targetIndex + 1;
  const descendantsEndIndex = targetIndex + descendantCount + 1;
  const descendants = projects.slice(
    descendantsStartIndex,
    descendantsEndIndex,
  );

  const newProjects = [
    ...projects.slice(0, descendantsStartIndex),
    ...projects.slice(descendantsEndIndex),
  ];

  newProjects[targetIndex].isDragging = true;

  return { results: newProjects, removedDescendants: descendants };
};

export const dragEnd = (
  projects: FlatProject[],
  id: string,
  removedDescendants: FlatProject[],
): FlatProject[] => {
  const rawNewProjects = projects.flatMap((p) => {
    if (p.id === id) {
      return [
        { ...p, isDragging: false },
        ...removedDescendants.map((descendant) => {
          const parentDepth = p.depth;
          const descendantRootDepth = removedDescendants[0].depth;

          return {
            ...descendant,
            depth: descendant.depth - descendantRootDepth + parentDepth + 1,
          };
        }),
      ];
    }
    return p;
  });

  const newProjects = toFlatProjects(toProjects(rawNewProjects));
  return newProjects;
};
