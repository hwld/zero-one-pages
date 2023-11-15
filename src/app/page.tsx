import clsx from "clsx";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={clsx(
        inter.className,
        "flex h-[100dvh] items-center justify-center bg-neutral-800",
      )}
    >
      <div className="flex flex-col gap-6 text-center text-neutral-300">
        <h1 className="max-w-2xl text-7xl font-bold">Zero one pages</h1>
        <p className="text-lg">0から作った画面をまとめる</p>
      </div>
    </div>
  );
}
