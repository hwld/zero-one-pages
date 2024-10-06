import { describe, expect, it } from "vitest";
import type { Project } from "../../../_backend/project/model";
import {
  moveProject,
  toProjectMap,
  toProjectNodes,
  toProjects,
  updateProjectDepth,
  type ProjectNode,
} from "./project";
import { ProjectExpansionMap } from "./expansion-map";
import { genProject } from "../../../_backend/project/model.test";

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

  describe("toProjects", () => {
    it("ProjectNodesをProjectsに変換できる", () => {
      const nodes: ProjectNode[] = [
        genProjectNode({ id: "1", depth: 0, descendantsProjectCount: 2 }),
        genProjectNode({ id: "1-1", parentId: "1", depth: 1 }),
        genProjectNode({
          id: "1-2",
          parentId: "1",
          depth: 1,
          descendantsProjectCount: 1,
        }),
        genProjectNode({ id: "1-2-1", parentId: "1-2", depth: 2 }),
        genProjectNode({ id: "2", depth: 0 }),
      ];

      const projectIds = toProjects(nodes);

      expect(projectIds[0].id).toBe("1");
      expect(projectIds[0].subProjects[0].id).toBe("1-1");
      expect(projectIds[0].subProjects[1].id).toBe("1-2");
      expect(projectIds[0].subProjects[1].subProjects[0].id).toBe("1-2-1");
      expect(projectIds[1].id).toBe("2");
    });
  });

  describe("moveProject", () => {
    it("移動したプロジェクトのorderが正しく変更される", () => {
      const projects: Project[] = [
        genProject({ id: "3", order: 2 }),
        genProject({ id: "2", order: 1 }),
        genProject({ id: "1", order: 0 }),
      ];

      const result = moveProject(projects, new ProjectExpansionMap(), "1", "3");
      const reusltMap = new Map(result.map((r) => [r.id, r]));

      expect(reusltMap.get("2")?.order).toBe(0);
      expect(reusltMap.get("3")?.order).toBe(1);
      expect(reusltMap.get("1")?.order).toBe(2);
    });

    it("子を持っているが閉じられているプロジェクトの下に移動するとき、orderが正しく変更される", () => {
      const projects: Project[] = [
        genProject({ id: "1", order: 0 }),
        genProject({
          id: "2",
          order: 1,
          subProjects: [genProject({ id: "2-1", parentId: "2", order: 0 })],
        }),
      ];

      const result = moveProject(
        projects,
        new ProjectExpansionMap().toggle("2", false),
        "1",
        "2",
      );
      const resultMap = toProjectMap(result);

      expect(resultMap.get("2")?.order).toEqual(0);
      expect(resultMap.get("1")?.order).toEqual(1);
    });

    it("子を持っていて展開しているプロジェクトの下に移動するとき、そのプロジェクトの最初の子にする", () => {
      const projects: Project[] = [
        genProject({ id: "1", order: 0 }),
        genProject({
          id: "2",
          order: 1,
          subProjects: [genProject({ id: "2-1", parentId: "2", order: 0 })],
        }),
      ];

      const result = moveProject(
        projects,
        new ProjectExpansionMap().toggle("2", true),
        "1",
        "2",
      );
      const resultMap = toProjectMap(result);

      expect(resultMap.get("2")?.order).toEqual(0);
      expect(resultMap.get("1")?.parentId).toEqual("2");
      expect(resultMap.get("1")?.order).toEqual(0);
      expect(resultMap.get("2-1")?.parentId).toEqual("2");
      expect(resultMap.get("2-1")?.order).toEqual(1);
    });
  });

  describe("changeProjectDepth", () => {
    it("あるプロジェクトの子以上のdepthを指定しても子になる", () => {
      const nodes: ProjectNode[] = [
        genProjectNode({ id: "1", depth: 0, descendantsProjectCount: 2 }),
        genProjectNode({ id: "1-1", parentId: "1", depth: 1 }),
        genProjectNode({ id: "1-1-1", parentId: "1", depth: 1 }),
      ];

      const result = updateProjectDepth(
        toProjects(nodes),
        new ProjectExpansionMap(),
        "1-1-1",
        100000,
      );
      const resultMap = toProjectMap(result);

      expect(resultMap.get("1-1-1")?.parentId).toEqual("1-1");
    });

    it("他のプロジェクトの親にはなれない", () => {
      const nodes: ProjectNode[] = [
        genProjectNode({ id: "1", depth: 0, descendantsProjectCount: 2 }),
        genProjectNode({ id: "1-1", parentId: "1", depth: 1 }),
        genProjectNode({ id: "1-2", parentId: "1", depth: 1 }),
      ];

      const result = updateProjectDepth(
        toProjects(nodes),
        new ProjectExpansionMap(),
        "1-1",
        0,
      );
      const resultMap = toProjectMap(result);

      expect(resultMap.get("1-1")?.parentId).toEqual("1");
      expect(resultMap.get("1-2")?.parentId).toEqual("1");
    });
  });
});

const genProjectNode = (node: Partial<ProjectNode>): ProjectNode => ({
  id: node.id ?? crypto.randomUUID(),
  label: node.label ?? "node",
  depth: node.depth ?? 0,
  parentId: node.parentId ?? null,
  descendantsProjectCount: node.descendantsProjectCount ?? 0,
  todos: node.todos ?? 0,
  visible: node.visible ?? true,
});
