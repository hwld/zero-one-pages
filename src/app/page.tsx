"use client";

import clsx from "clsx";
import Link from "next/link";
import { Page, pages } from "./pages";
import { ReactNode } from "react";
import { SparklesIcon } from "lucide-react";
import { IoLogoGithub } from "react-icons/io";
import { useBodyBgColor } from "@/lib/useBodyBgColor";

export default function Home() {
  const bgClass = "bg-zinc-900";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "flex h-[100dvh] flex-col items-center overflow-auto pb-6 pt-[200px]",
        // chromeでキーボードを操作しているとなぜかfocus-visibleがあたることがあるので
        "focus-visible:outline-none",
        bgClass,
      )}
      style={{ colorScheme: "dark" }}
    >
      <div className="flex w-[500px] max-w-full flex-col gap-2 px-5 text-center text-zinc-200">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">Zero one ui</h1>
          <a
            href="https://github.com/hwld/zero-one-ui"
            target="_blank"
            className="grid size-[30px] place-items-center rounded  transition-colors hover:bg-white/15"
          >
            <IoLogoGithub
              className="fill-neutral-200"
              style={{ fontSize: "23" }}
            />
          </a>
        </div>
        <p className="text-center text-sm text-zinc-400">
          ReactでいろんなUIを作ります
          <br />`<kbd className="text-zinc-300">/</kbd>
          `キーでページの移動やページ毎のコマンドを
          <br />
          実行するためのメニューを開くことができます
        </p>
      </div>
      <div className="mt-[80px] grid max-w-[950px] grid-cols-1 gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((p, i) => {
          return <PageCard page={p} key={p.href} number={i + 1} />;
        })}
      </div>
    </div>
  );
}

type Props = { page: Page; number: number };
const PageCard: React.FC<Props> = (props) => {
  const isPrime = props.page.tags.includes("PRIME");

  return (
    <Link
      href={props.page.href}
      className={clsx(
        "group flex flex-col gap-2 rounded-lg  border bg-zinc-800 px-4 pb-2 pt-4 text-zinc-200 transition-colors hover:bg-zinc-700",
        isPrime ? "border-violet-400" : "border-zinc-700",
      )}
    >
      <div className="flex items-center gap-1">
        <p className="text-zinc-400">{props.number}.</p>
        {isPrime && (
          <SparklesIcon className="fill-violet-400 text-violet-400" size={18} />
        )}
        <p>{props.page.title}</p>
      </div>
      <div className="grow whitespace-pre-wrap text-sm text-zinc-400">
        {props.page.description}
      </div>
      <div className="h-[1px] bg-zinc-700" />
      <div className="flex flex-wrap gap-2">
        {props.page.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </Link>
  );
};

const Tag: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-400 transition-colors group-hover:bg-black/20">
      {children}
    </div>
  );
};
