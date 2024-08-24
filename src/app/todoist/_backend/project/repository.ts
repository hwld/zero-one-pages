import { z } from "zod";
import { initialData } from "./data";
import { Project } from "./model";

// 他のUIではStoreという名前にしているが、今回は薄いデータのラッパーではなくて、ドメインモデルを扱いたかったので
// Repositoryという名前にしてみる
class ProjectRepository {
  private projectRecords = initialData;

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

  public getAll(): Project[] {
    return recordsToProjects(this.projectRecords);
  }

  public getSiblingsMaxOrder(parentId: string | null): number {
    const siblingOrders = this.projectRecords
      .filter((p) => p.parentId === parentId)
      .map((p) => p.order);

    return siblingOrders.length > 0 ? Math.max(...siblingOrders) : 0;
  }

  public add(input: {
    label: string;
    parentId: string | null;
    order?: number;
  }) {
    const newOrder =
      input.order ?? this.getSiblingsMaxOrder(input.parentId) + 1;

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
  }

  public addAdjacent({
    label,
    position,
    referenceProjectId,
  }: {
    label: string;
    position: "before" | "after";
    referenceProjectId: string;
  }) {
    const referenceProject = this.get(referenceProjectId);
    if (!referenceProject) {
      throw new Error(`プロジェクトが存在しない: ${referenceProjectId}`);
    }

    if (position === "before") {
      const newParentId = referenceProject.parentId;
      const newOrder = referenceProject.order;

      this.add({ parentId: newParentId, order: newOrder, label });
    } else if (position === "after") {
      //　基準となるプロジェクトがサブプロジェクトを持っていたら、サブプロジェクトのorder:0に追加する
      const hasSubProjects = referenceProject.subProjects.length !== 0;
      const newParentId = hasSubProjects
        ? referenceProject.id
        : referenceProject.parentId;
      const newOrder = hasSubProjects ? 0 : referenceProject.order + 1;

      this.add({ parentId: newParentId, order: newOrder, label });
    }
  }

  public update(input: { id: string; label: string }) {
    this.projectRecords = this.projectRecords.map((p) => {
      if (p.id === input.id) {
        return { ...p, label: input.label };
      }
      return p;
    });
  }
  public updatePosition({
    projectId,
    order,
    parentProjectId,
  }: {
    order: number;
    projectId: string;
    parentProjectId: string | null;
  }) {
    this.projectRecords = this.projectRecords.map((record): ProjectRecord => {
      if (projectId === record.id) {
        return { ...record, order, parentId: parentProjectId };
      }
      return record;
    });
  }

  public remove(id: string) {
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
  }
}

export const projectRepository = new ProjectRepository();

export const projectRecordSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  label: z.string(),
  order: z.number(),
});
export type ProjectRecord = z.infer<typeof projectRecordSchema>;

const recordsToProjects = (projectRecords: ProjectRecord[]): Project[] => {
  type ProjectId = string;
  const projectMap = new Map<ProjectId, Project>();

  // この配列の要素のsubProjectsをミュータブルに書き換えていく
  const projects = projectRecords.map(
    (r): Project => ({ ...r, subProjects: [], todos: 0 }),
  );

  // すべてのProjectをMapに詰める
  projects.forEach((project) => projectMap.set(project.id, project));

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
