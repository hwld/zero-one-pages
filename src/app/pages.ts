export type Page = { href: string; title: string; description: string };

export const pages: Page[] = [
  {
    href: "/1",
    title: "todoリスト",
    description:
      "浮いてるinputを使ったTodoリスト。\ninputの隣のメニューがお気に入り。",
  },
  {
    href: "/2",
    title: "todoリスト2",
    description:
      "表形式のtodoリスト。\nテーブルの部分だけカードになっているのがお気に入り。",
  },
  {
    href: "/3",
    title: "変形するメニュー",
    description: "youtubeの設定メニューを見て作りたくなった。\n🥱🥱🥱😀😀😀",
  },
  {
    href: "/4",
    title: "チャット",
    description:
      "DiscordみたいなUI。\nページレイアウトにFlexではなくてGridを使ってみた。",
  },
  {
    href: "/5",
    title: "変形するメニュー2",
    description:
      "Dynamic Islandみたいなメニュー。\nframer-motionでspring animationを使ってみた。",
  },
];
