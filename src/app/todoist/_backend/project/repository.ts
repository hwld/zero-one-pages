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

  public add(input: { parentId: string | null; label: string; order: number }) {
    const newRecord: ProjectRecord = {
      id: crypto.randomUUID(),
      parentId: input.parentId,
      label: input.label,
      order: input.order,
    };

    this.projectRecords = [...this.projectRecords, newRecord];
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

  public remove() {
    throw new Error("未実装");
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
