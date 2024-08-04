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

const toProjects = (flats: FlatProject[]): Project[] => {
  const buildSubProjects = (flats: FlatProject[], depth: number): Project[] => {
    const result: Project[] = [];

    while (flats.length > 0 && flats[0].depth === depth) {
      const flat = flats.shift()!;
      const subProjects = buildSubProjects(flats, depth + 1);

      result.push({
        id: flat.id,
        label: flat.label,
        todos: flat.todos,
        expanded: flat.expanded,
        subProjects: subProjects,
      });
    }

    return result;
  };

  return buildSubProjects(flats, 0);
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
