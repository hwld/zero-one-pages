import clsx from "clsx";
import {
  ChevronDown,
  CircleDotIcon,
  GitPullRequestIcon,
  InboxIcon,
  LucideIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  TerminalIcon,
} from "lucide-react";
import React from "react";
import { ReactNode } from "react";

const GitHubProjectPage: React.FC = () => {
  return (
    <div className="grid h-[100dvh] w-[100dvw] grid-rows-[64px_48px_1fr] bg-neutral-900 text-neutral-100">
      <Header />
      <div></div>
      <div>
        <div></div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default GitHubProjectPage;

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-600 px-4">
      <div className="flex items-center gap-4">
        <HeaderButton icon={MenuIcon} />
        <div className="size-8 rounded-full bg-neutral-300" />
        <div className="flex items-center">
          <BreadCrumbItem>hwld</BreadCrumbItem>
          <BreadCrumbSeparator />
          <BreadCrumbItem>projects</BreadCrumbItem>
          <BreadCrumbSeparator />
          <BreadCrumbItem active>zero-one-ui</BreadCrumbItem>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-[350px] cursor-pointer items-center justify-between rounded border border-neutral-600 px-2 text-neutral-400">
          <div className="flex items-center gap-2">
            <SearchIcon size={16} />
            <div className="text-sm">
              Type
              <kbd className="mx-1 rounded border border-neutral-400 px-[3px]">
                /
              </kbd>
              to search
            </div>
          </div>
          <div className="flex h-full items-center gap-2">
            <div className="h-2/3 w-[1px] bg-neutral-600" />
            <TerminalIcon size={16} />
          </div>
        </button>
        <div className="h-5 w-[1px] bg-neutral-600" />
        <HeaderButton icon={PlusIcon} rightIcon={ChevronDown} />
        <HeaderButton icon={CircleDotIcon} />
        <HeaderButton icon={GitPullRequestIcon} />
        <HeaderButton icon={InboxIcon} />
        <div className="size-8 rounded-full bg-neutral-300" />
      </div>
    </div>
  );
};

const BreadCrumbSeparator: React.FC = () => {
  return <span className="text-sm text-neutral-400">/</span>;
};

const BreadCrumbItem: React.FC<{ children: ReactNode; active?: boolean }> = ({
  children,
  active = false,
}) => {
  return (
    <button
      className={clsx(
        "flex h-6 cursor-pointer items-center rounded px-1 text-sm transition-colors hover:bg-white/15",
        active && "font-bold",
      )}
    >
      {children}
    </button>
  );
};

const HeaderButton: React.FC<{ icon: LucideIcon; rightIcon?: LucideIcon }> = ({
  icon: Icon,
  rightIcon: RightIcon,
}) => {
  return (
    <button
      className={clsx(
        "flex h-8 cursor-pointer items-center justify-center gap-1 rounded border border-neutral-600 text-neutral-400 transition-colors hover:bg-white/10",
        RightIcon ? "px-2" : "w-8",
      )}
    >
      <Icon size={18} />
      {RightIcon && <RightIcon size={18} />}
    </button>
  );
};
