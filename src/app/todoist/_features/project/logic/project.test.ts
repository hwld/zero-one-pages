import { describe, expect, it } from "vitest";
import type { Project } from "../../../_backend/project/model";
import { toProjectNodes } from "./project";
import { ProjectExpansionMap } from "./expansion-map";

describe("project", () => {
  describe("toProjectNodes", () => {
    it("ProjectのorderにしたがってProjectNodeが並び替えられる", () => {
      const projects: Project[] = [
        genProject({ id: "2", order: 1 }),
        genProject({
          id: "1",
          order: 0,
          subProjects: [
            genProject({ id: "1-2", order: 1 }),
            genProject({ id: "1-1", order: 0 }),
          ],
        }),
      ];

      const nodeIds = toProjectNodes(projects, new ProjectExpansionMap()).map(
        (n) => n.id,
      );

      expect(nodeIds).toEqual(["1", "1-1", "1-2", "2"]);
    });
  });
});

const genProject = (project: Partial<Project>): Project => ({
  id: project.id ?? crypto.randomUUID(),
  label: project.label ?? "project",
  parentId: project.parentId ?? null,
  order: project.order ?? 0,
  subProjects: project.subProjects ?? [],
  todos: project.todos ?? 0,
});
