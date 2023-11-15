import clsx from "clsx";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Page, pages } from "./pages";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={clsx(
        inter.className,
        "flex h-[100dvh] flex-col items-center justify-center gap-10 bg-zinc-900",
      )}
    >
      <div className="flex flex-col gap-3 text-center text-zinc-200">
        <h1 className="text-3xl font-bold">Zero one pages</h1>
        <p className="text-sm">0から作った画面をまとめる</p>
      </div>
      {pages.map((p, i) => {
        return <PageCard page={p} key={p.href} number={i + 1} />;
      })}
    </div>
  );
}

const PageCard: React.FC<{ page: Page; number: number }> = ({ page, number }) => {
  return (
    <Link
      href={page.href}
      className="flex w-[300px] flex-col gap-3 rounded-lg border border-zinc-500 p-5 text-zinc-200 hover:bg-white/5"
    >
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold">{number}.</div>
        <div>{page.title}</div>
      </div>
      <div className="h-[1px] bg-zinc-600" />
      <p>{page.description}</p>
    </Link>
  );
};
