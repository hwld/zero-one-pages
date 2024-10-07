import { initialData } from "./data";
import {
  Project,
  type ValidatedCreateInput,
  type ValidatedUpdateInput,
  type ValidatedUpdatePositionInput,
} from "./model";

export type ProjectRecord = {
  id: string;
  parentId: string | null;
  label: string;
  order: number;
};

// 他のUIではStoreという名前にしているが、今回は薄いデータのラッパーではなくて、ドメインモデルを扱いたかったので
// Repositoryという名前にしてみる
class ProjectRepository {
  private projectRecords: ProjectRecord[] = initialData;

  public get(id: string): Project | undefined {
    const _get = (projects: Project[]): Project | undefined => {
      for (const project of projects) {
        if (project.id === id) {
          return project;
        }

        const found = _get(project.subProjects);
        if (found) {
          return found;
        }
      }

      return undefined;
    };

    return _get(this.getAll());
  }

  public getAll = (): Project[] => {
    return recordsToProjects(this.projectRecords);
  };

  public getMany = (ids: string[]): Project[] => {
    return ids.map((id) => this.get(id)).filter((p) => p !== undefined);
  };

  public getMaxOrderByParentId = (parentId: string | null): number => {
    const siblingOrders = this.projectRecords
      .filter((p) => p.parentId === parentId)
      .map((p) => p.order);

    return siblingOrders.length > 0 ? Math.max(...siblingOrders) : 0;
  };

  public add = (input: ValidatedCreateInput) => {
    const newOrder =
      input.order ?? this.getMaxOrderByParentId(input.parentId) + 1;

    const newRecord: ProjectRecord = {
      id: crypto.randomUUID(),
      parentId: input.parentId,
      label: input.label,
      order: newOrder,
    };

    this.projectRecords = this.projectRecords.map((p) => {
      if (p.parentId === input.parentId && p.order >= newOrder) {
        return { ...p, order: p.order + 1 };
      }
      return p;
    });

    this.projectRecords = [...this.projectRecords, newRecord];
  };

  public update = (input: ValidatedUpdateInput) => {
    this.projectRecords = this.projectRecords.map((p) => {
      if (p.id === input.id) {
        return { ...p, label: input.label };
      }
      return p;
    });
  };
  public updatePosition = ({
    projectId,
    order,
    parentProjectId,
  }: ValidatedUpdatePositionInput) => {
    this.projectRecords = this.projectRecords.map((record): ProjectRecord => {
      if (projectId === record.id) {
        return { ...record, order, parentId: parentProjectId };
      }
      return record;
    });
  };

  public remove = (id: string) => {
    const targetProject = this.projectRecords.find((p) => p.id === id);
    if (!targetProject) {
      throw new Error("プロジェクトが存在しない");
    }

    const targetIds: string[] = [];
    const pushDescendantIds = (id: string) => {
      targetIds.push(id);

      this.projectRecords.forEach((p) => {
        if (p.parentId === id) {
          pushDescendantIds(p.id);
        }
      });
    };

    pushDescendantIds(targetProject.id);

    this.projectRecords = this.projectRecords
      .filter((p) => !targetIds.includes(p.id))
      .map((project) => {
        if (
          project.parentId === targetProject.parentId &&
          project.order < targetProject.order
        ) {
          return { ...project, order: project.order - 1 };
        }

        return project;
      });
  };
}

export const projectRepository = new ProjectRepository();

const recordsToProjects = (projectRecords: ProjectRecord[]): Project[] => {
  // このMapの要素のsubProjectsをmutableに書き換えていく
  const projectMap = new Map<string, Project>(
    projectRecords.map((r) => [
      r.id,
      {
        id: r.id,
        parentId: r.parentId,
        label: r.label,
        order: r.order,
        subProjects: [],
        todos: 0,
      } satisfies Project,
    ]),
  );

  const projects = Array.from(projectMap.values());

  projects.forEach((project) => {
    if (!project.parentId) {
      return;
    }

    const parent = projectMap.get(project.parentId);
    if (!parent) {
      throw new Error(
        `親プロジェクトが存在しない id:${project.id}, parentId:${project.parentId}`,
      );
    }

    parent.subProjects.push(project);
    parent.subProjects.sort((a, b) => a.order - b.order);
  });

  const result = projects
    .filter((project) => !project.parentId)
    .sort((a, b) => a.order - b.order);

  return result;
};
