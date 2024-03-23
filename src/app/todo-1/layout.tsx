import clsx from "clsx";
import { ReactNode, Suspense } from "react";
import { SideBar } from "./_components/side-bar/side-bar";

type Props = { children: ReactNode; modal: ReactNode };
const Layout: React.FC<Props> = ({ children, modal }) => {
  return (
    <div className={clsx("flex h-[100dvh] bg-neutral-100 text-neutral-700")}>
      <SideBar />
      <div
        className="flex grow flex-col items-center overflow-auto px-2 pt-10"
        style={{ backgroundImage: "url(/1-bg.svg)", backgroundSize: "200px" }}
      >
        <Suspense>{children}</Suspense>
      </div>
      <Suspense>{modal}</Suspense>
    </div>
  );
};

export default Layout;
