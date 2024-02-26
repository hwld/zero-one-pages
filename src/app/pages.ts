type Tag = "PC" | "MOBILE" | "LAYOUT" | "PART";
export type Page = {
  href: string;
  title: string;
  description: string;
  tags: Tag[];
};

export const pages: Page[] = [
  {
    href: "/todo-1",
    title: "todoリスト",
    description:
      "浮いてるinputを使ったTodoリスト。\ninputの隣のメニューがお気に入り。",
    tags: ["PC", "MOBILE", "LAYOUT"],
  },
  {
    href: "/todo-2",
    title: "todoリスト2",
    description:
      "表形式のtodoリスト。\nテーブルの部分だけカードになっているのがお気に入り。",
    tags: ["PC", "LAYOUT"],
  },
  {
    href: "/dynamic-menu",
    title: "変形するメニュー",
    description: "youtubeの設定メニューを見て作りたくなった。\n🥱🥱🥱😀😀😀",
    tags: ["PC", "MOBILE", "PART"],
  },
  {
    href: "/chat",
    title: "チャット",
    description:
      "DiscordみたいなUI。\n設定ページを初めて作ったが、項目が多いとレイアウトが大変そうだなぁと思った。",
    tags: ["PC", "LAYOUT"],
  },
  {
    href: "/dynamic-island",
    title: "変形するメニュー2",
    description:
      "Dynamic Islandみたいなメニュー。\nframer-motionでspring animationを使ってみた。",
    tags: ["PC", "MOBILE", "PART"],
  },
];
