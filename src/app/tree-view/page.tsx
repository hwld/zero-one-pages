"use client";
import { useBodyBgColor } from "@/lib/useBodyBgColor";
import clsx from "clsx";
import { TreeNodeType, Treeview } from "./_components/tree-view";
import { useState } from "react";

const bgClass = "bg-slate-50";

const Page = () => {
  useBodyBgColor(bgClass);

  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className={clsx(bgClass, "grid h-screen place-items-center")}>
      <div className="h-[500px] w-[300px] overflow-auto rounded border border-slate-400 p-3">
        <Treeview.Root label="??" value={selected} onChange={setSelected}>
          {data.map((node) => (
            <Treeview.Node node={node} key={node.id} />
          ))}
        </Treeview.Root>
      </div>
    </div>
  );
};

export default Page;

export const data: TreeNodeType[] = [
  {
    id: crypto.randomUUID(),
    name: "components",
    children: [
      {
        id: crypto.randomUUID(),
        name: "toggle-group",
        children: [
          {
            id: crypto.randomUUID(),
            name: "index.ts",
          },
          {
            id: crypto.randomUUID(),
            name: "toggle-group.tsx",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "treeview",
        children: [
          {
            id: crypto.randomUUID(),
            name: "icons.tsx",
          },
          {
            id: crypto.randomUUID(),
            name: "index.tsx",
          },
          {
            id: crypto.randomUUID(),
            name: "treeview.tsx",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "long-component-folder-name-that-overflows",
        children: [
          {
            id: crypto.randomUUID(),
            name: "index.tsx",
          },
          {
            id: crypto.randomUUID(),
            name: "long-component.tsx",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "index.tsx",
      },
      {
        id: crypto.randomUUID(),
        name: "long-util-file-name-that-overflows.tsx",
      },
      {
        id: crypto.randomUUID(),
        name: "roving-tabindex.tsx",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "lib",
    children: [
      {
        id: crypto.randomUUID(),
        name: "treeview",
        children: [
          {
            id: crypto.randomUUID(),
            name: "index.ts",
          },
          {
            id: crypto.randomUUID(),
            name: "initialValue.ts",
          },
          {
            id: crypto.randomUUID(),
            name: "tree-state.tsx",
          },
          {
            id: crypto.randomUUID(),
            name: "useTreeNode.tsx",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "utils",
        children: [
          {
            id: crypto.randomUUID(),
            name: "chainable-map.ts",
          },
          {
            id: crypto.randomUUID(),
            name: "index.ts",
          },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "pages",
    children: [
      {
        id: crypto.randomUUID(),
        name: "_app.tsx",
      },
      {
        id: crypto.randomUUID(),
        name: "_document.tsx",
      },
      {
        id: crypto.randomUUID(),
        name: "index.tsx",
      },
      {
        id: crypto.randomUUID(),
        name: "toggle-group.tsx",
      },
      {
        id: crypto.randomUUID(),
        name: "treeview.tsx",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "public",
    children: [
      {
        id: crypto.randomUUID(),
        name: "favicon.ico",
      },
      {
        id: crypto.randomUUID(),
        name: "file.png",
      },
      {
        id: crypto.randomUUID(),
        name: "folder.png",
      },
      {
        id: crypto.randomUUID(),
        name: "next.svg",
      },
      {
        id: crypto.randomUUID(),
        name: "thirteen.svg",
      },
      {
        id: crypto.randomUUID(),
        name: "vercel.svg",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "styles",
    children: [
      {
        id: crypto.randomUUID(),
        name: "global.css",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: ".eslintrc.json",
  },
  {
    id: crypto.randomUUID(),
    name: ".gitignore",
  },
  {
    id: crypto.randomUUID(),
    name: ".prettierrc.js",
  },
  {
    id: crypto.randomUUID(),
    name: "next-env.d.ts",
  },
  {
    id: crypto.randomUUID(),
    name: "next.config.js",
  },
  {
    id: crypto.randomUUID(),
    name: "package.json",
  },
  {
    id: crypto.randomUUID(),
    name: "postcss.config.js",
  },
  {
    id: crypto.randomUUID(),
    name: "README.md",
  },
  {
    id: crypto.randomUUID(),
    name: "tailwind.config.js",
  },
  {
    id: crypto.randomUUID(),
    name: "tsconfig.json",
  },
  {
    id: crypto.randomUUID(),
    name: "yarn.lock",
  },
];
