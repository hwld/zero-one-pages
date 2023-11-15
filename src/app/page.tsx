import clsx from "clsx";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ReactNode } from "react";

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
      <div className="flex gap-2 text-xl">
        <LinkItem href="/1">1</LinkItem>
      </div>
    </div>
  );
}

const LinkItem: React.FC<{ href: string; children: ReactNode }> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="flex h-[30px] w-[30px] items-center justify-center rounded border border-zinc-300 transition-all duration-150 hover:bg-white/20"
    >
      {children}
    </Link>
  );
};
