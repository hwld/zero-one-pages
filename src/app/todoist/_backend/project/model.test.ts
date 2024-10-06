import { describe, expect, it } from "vitest";
import { getOrderBasedOnProject, type Project } from "./model";

describe("project model", () => {
  describe("getOrderBasedOnProject", () => {
    it("あるプロジェクトのbeforeのorderを正しく取得できる", () => {
      const baseProject = genProject({
        id: "1",
        order: 10,
        parentId: "parent",
        subProjects: [genProject(), genProject()],
      });

      const order = getOrderBasedOnProject({
        baseProject,
        position: "before",
      });

      expect(order.parentId).toBe("parent");
      expect(order.order).toBe(10);
    });

    it("サブプロジェクトが存在しないプロジェクトのafterのorderを正しく取得できる", () => {
      const baseProject = genProject({
        id: "1",
        order: 10,
        parentId: "parent",
        subProjects: [],
      });

      const order = getOrderBasedOnProject({
        baseProject,
        position: "after",
      });

      expect(order.parentId).toBe("parent");
      expect(order.order).toBe(11);
    });

    it("サブプロジェクトが存在するプロジェクトのafterのorderを正しく取得できる", () => {
      const baseProject = genProject({
        id: "1",
        order: 10,
        parentId: "parent",
        subProjects: [genProject(), genProject()],
      });

      const order = getOrderBasedOnProject({
        baseProject,
        position: "after",
      });

      expect(order.parentId).toBe("1");
      expect(order.order).toBe(0);
    });
  });
});

export const genProject = (project?: Partial<Project>): Project => {
  return {
    id: project?.id ?? crypto.randomUUID(),
    label: project?.label ?? "project",
    order: project?.order ?? 0,
    parentId: project?.parentId ?? null,
    subProjects: project?.subProjects ?? [],
    todos: project?.todos ?? 0,
  };
};
