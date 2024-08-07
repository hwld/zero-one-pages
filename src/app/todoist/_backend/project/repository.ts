import { z } from "zod";
import { initialData } from "./data";
import { ProjectSummary } from "./model";

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

  public getAll(): ProjectSummary[] {
    return ProjectRepository.recordToProject(this.projectRecords);
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
  public update() {
    throw new Error("未実装");
  }

  public remove() {
    throw new Error("未実装");
  }

  private static imp() {}

  private static recordToProject(
    projectRecords: ProjectRecord[],
  ): ProjectSummary[] {
    type ProjectId = string;
    const projectMap = new Map<ProjectId, ProjectSummary>();

    // この配列の要素のsubProjectsをミュータブルに書き換えていく
    const summaries = projectRecords.map(
      (r): ProjectSummary => ({ ...r, subProjects: [] }),
    );

    // すべてのSummaryをMapに詰める
    summaries.forEach((summary) => projectMap.set(summary.id, summary));

    summaries.forEach((summary) => {
      if (!summary.parentId) {
        return;
      }

      const parent = projectMap.get(summary.parentId);
      if (!parent) {
        throw new Error(
          `親プロジェクトが存在しない id:${summary.id}, parentId:${summary.parentId}`,
        );
      }

      parent.subProjects.push(summary);
      parent.subProjects.sort((a, b) => a.order - b.order);
    });

    const result = summaries
      .filter((summary) => !summary.parentId)
      .sort((a, b) => a.order - b.order);

    return result;
  }
}

export const projectRepository = new ProjectRepository();
