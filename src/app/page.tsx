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
        "flex h-[100dvh] flex-col items-center overflow-auto bg-zinc-900 pt-[200px]",
      )}
    >
      <div className="flex flex-col gap-2 text-center text-zinc-200">
        <h1 className="text-3xl font-bold">Zero one ui</h1>
        <p className="text-sm text-zinc-400">uiを作る</p>
      </div>
      <div className="mt-[80px] flex max-w-[950px] flex-wrap justify-center gap-5">
        {pages.map((p, i) => {
          return <PageCard page={p} key={p.href} number={i + 1} />;
        })}
        {[...new Array(9 - pages.length)].map((i) => {
          return <PageCard key={i} dummy />;
        })}
      </div>
    </div>
  );
}

type Props = { page: Page; number: number; dummy?: false } | { dummy: true };
const PageCard: React.FC<Props> = (props) => {
  const rootClass =
    "flex min-h-[130px] w-[300px] flex-col rounded-lg   bg-zinc-800 p-4 text-zinc-200 transition-colors border border-zinc-700";

  if (props.dummy) {
    return <div className={rootClass} />;
  }

  return (
    <Link
      href={props.page.href}
      className={clsx(rootClass, "hover:bg-zinc-700")}
    >
      {!props.dummy && (
        <>
          <div className="mt-1 flex items-center gap-1">
            <p className="text-zinc-400">{props.number}.</p>
            <p>{props.page.title}</p>
          </div>
          <div className="my-2 h-[1px] bg-zinc-700" />
          <div className="whitespace-pre-wrap text-sm text-zinc-400">
            {props.page.description}
          </div>
        </>
      )}
    </Link>
  );
};
