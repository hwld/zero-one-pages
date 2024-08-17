import { z } from "zod";
import { initialData } from "./data";
import { Project, ProjectPositionChange } from "./model";

export const projectRecordSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  label: z.string(),
  order: z.number(),
});
export type ProjectRecord = z.infer<typeof projectRecordSchema>;

// 他のUIではStoreという名前にしているが、今回は薄いデータのラッパーではなくて、ドメインモデルを扱いたかったので
// Repositoryという名前にしてみる
class ProjectRepository {
  private projectRecords = initialData;

  public getAll(): Project[] {
    return ProjectRepository.recordsToProjects(this.projectRecords);
  }

  public getSiblingsMaxOrder(parentId: string | null): number {
    return Math.max(
      ...this.projectRecords
        .filter((p) => p.parentId === parentId)
        .map((p) => p.order),
    );
  }

  public add(input: { parentId: string | null; label: string; order: number }) {
    const newRecord: ProjectRecord = {
      id: crypto.randomUUID(),
      parentId: input.parentId,
      label: input.label,
      order: input.order,
    };

    this.projectRecords = [...this.projectRecords, newRecord];
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
  }: ProjectPositionChange) {
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

  private static recordsToProjects(projectRecords: ProjectRecord[]): Project[] {
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
  }
}

export const projectRepository = new ProjectRepository();
