import clsx from "clsx";
import {
  ChevronDown,
  ChevronDownIcon,
  CircleDotIcon,
  GitPullRequestIcon,
  InboxIcon,
  KanbanSquareIcon,
  LineChartIcon,
  LucideIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PanelRightOpenIcon,
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
      <div className="flex items-center justify-between px-8">
        <div className="text-lg font-bold">zero-one-ui</div>
        <div className="flex items-center gap-2">
          <button className="h-5 rounded-full bg-neutral-700 px-2 text-xs font-bold text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200">
            Add status update
          </button>
          <div className="flex items-center">
            <ButtonGroupItem position="left" icon={LineChartIcon} />
            <ButtonGroupItem icon={PanelRightOpenIcon} />
            <ButtonGroupItem position="right" icon={MoreHorizontalIcon} />
          </div>
        </div>
      </div>
      <div className="grid grid-rows-[min-content_1fr]">
        <div className="flex gap-1 border-b border-neutral-600 px-8">
          <Tab active>Kanban1</Tab>
          <Tab>Kanban2</Tab>
          <Tab icon={PlusIcon}>New view</Tab>
        </div>
        <div className="flex bg-neutral-800">
          <SlicerPanel />
          <div className="p-4">main</div>
        </div>
      </div>
    </div>
  );
};
export default GitHubProjectPage;

const SlicerPanel: React.FC = () => {
  return (
    <div className="flex w-[350px] flex-col gap-2 overflow-auto border-r border-neutral-600 p-4">
      <button className="flex h-8 w-fit items-center gap-1 rounded-md px-2 text-sm hover:bg-white/10">
        <span>Status</span>
        <ChevronDownIcon size={16} />
      </button>
      <ul className="w-full [&>li:last-child]:border-b-0">
        <SlicerListItem
          active
          color="green"
          label="Todo"
          description="This item hasn't been started"
          count={10}
        />
        <SlicerListItem
          color="orange"
          label="In Progress"
          description="This is actively being worked on"
          count={5}
        />
        <SlicerListItem
          color="purple"
          label="Done"
          description="This has been completed"
          count={0}
        />
        <SlicerListItem
          color="gray"
          label="Archive"
          description="This item has been archived"
          count={3}
        />
        <SlicerListItem label="No status" count={100} />
      </ul>
    </div>
  );
};

const SlicerListItem: React.FC<{
  active?: boolean;
  color?: "green" | "orange" | "purple" | "gray" | "transparent";
  label: string;
  description?: string;
  count: number;
}> = ({ active = false, color = "transparent", label, description, count }) => {
  const iconClass = {
    green: "bg-green-600/20 border-green-600",
    orange: "bg-orange-600/20 border-orange-600",
    purple: "bg-purple-600/20 border-purple-600",
    gray: "bg-neutral-500/20 border-neutral-500",
    transparent: "bg-transparent border-transparent",
  };

  return (
    <li
      className={clsx(
        "relative w-full border-b border-neutral-700",
        active &&
          "before:absolute before:-left-3 before:bottom-2 before:top-2 before:w-1 before:rounded-full before:bg-blue-500 before:content-['']",
      )}
    >
      <button
        className={clsx(
          "flex w-full items-start justify-between rounded-md px-2 py-2 transition-colors hover:bg-white/10",
          description ? "h-14" : "",
        )}
      >
        <div className="flex items-start gap-2">
          <div
            className={clsx("size-4 rounded-full border-2", iconClass[color])}
          />
          <div className="flex flex-col items-start">
            <div className="text-sm">{label}</div>
            {description && (
              <div className="text-xs text-neutral-400">{description}</div>
            )}
          </div>
        </div>
        <div className="min-w-6 rounded-full bg-white/10 p-1 text-xs text-neutral-400">
          {count}
        </div>
      </button>
    </li>
  );
};

const Tab: React.FC<{
  active?: boolean;
  children: ReactNode;
  icon?: LucideIcon;
}> = ({ children, icon: Icon = KanbanSquareIcon, active = false }) => {
  const Wrapper = active ? "div" : "button";

  return (
    <Wrapper
      className={clsx(
        "-mb-[1px] flex h-10 items-center gap-4 rounded-t-md border-neutral-600 px-4",
        active
          ? "border-x border-t bg-neutral-800 text-neutral-100"
          : "text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon size={20} />
        <div className="text-sm">{children}</div>
      </div>
      {active && (
        <button className="flex size-5 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200">
          <ChevronDownIcon size={16} />
        </button>
      )}
    </Wrapper>
  );
};

const ButtonGroupItem: React.FC<{
  icon: LucideIcon;
  position?: "left" | "center" | "right";
}> = ({ icon: Icon, position = "center" }) => {
  const positionClass = {
    left: "border-x rounded-l-md",
    center: "",
    right: "border-x rounded-r-md",
  };

  return (
    <button
      className={clsx(
        "flex h-8 w-9 items-center justify-center border-y border-neutral-700 bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-600",
        positionClass[position],
      )}
    >
      <Icon size={20} />
    </button>
  );
};

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
        <button className="flex h-8 w-[350px] cursor-pointer items-center justify-between rounded-md border border-neutral-600 px-2 text-neutral-400">
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
        "flex h-6 cursor-pointer items-center rounded-md px-1 text-sm transition-colors hover:bg-white/15",
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
        "flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-600 text-neutral-400 transition-colors hover:bg-white/10",
        RightIcon ? "px-2" : "w-8",
      )}
    >
      <Icon size={18} />
      {RightIcon && <RightIcon size={18} />}
    </button>
  );
};
