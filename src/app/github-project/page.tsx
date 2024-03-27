import clsx from "clsx";
import {
  ChevronDown,
  ChevronDownIcon,
  CircleDashedIcon,
  CircleDotIcon,
  GitPullRequestIcon,
  InboxIcon,
  KanbanSquareIcon,
  LineChartIcon,
  ListFilterIcon,
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

type Kanban = {
  color: StatusIconColor;
  status: "Todo" | "In Progress" | "Done" | "Archive" | "On Hold";
  count: number;
  description: string;
};
const kanbans: Kanban[] = [
  {
    color: "green",
    status: "Todo",
    count: 10,
    description: "This item hasn't been started",
  },
  {
    color: "orange",
    status: "In Progress",
    count: 5,
    description: "This is actively being worked on",
  },
  {
    color: "red",
    status: "On Hold",
    count: 3,
    description: "This item is on hold",
  },
  {
    color: "purple",
    status: "Done",
    count: 0,
    description: "This has been completed",
  },
  {
    color: "gray",
    status: "Archive",
    count: 3,
    description: "This item has been archived",
  },
];

const GitHubProjectPage: React.FC = () => {
  return (
    <div
      className="grid h-[100dvh] w-[100dvw] grid-rows-[64px_48px_minmax(0,1fr)] overflow-hidden bg-neutral-900 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
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
      <div className="grid grid-rows-[min-content_minmax(0,1fr)]">
        <div className="flex gap-1 border-b border-neutral-600 px-8">
          <Tab active>Kanban1</Tab>
          <Tab>Kanban2</Tab>
          <Tab icon={PlusIcon}>New view</Tab>
        </div>
        <div className="flex w-[100dvw] bg-neutral-800">
          <SlicerPanel />
          <MainPanel />
        </div>
      </div>
    </div>
  );
};
export default GitHubProjectPage;

const MainPanel: React.FC = () => {
  return (
    <div className="flex min-w-0 grow flex-col">
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-8 grow items-center rounded-md border border-neutral-600 bg-transparent pl-2 focus-within:border-blue-500">
          <ListFilterIcon size={16} className="text-neutral-400" />
          <input
            className="h-full grow bg-transparent px-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none"
            placeholder="Filter by keyword or by field"
          />
        </div>
        <div className="flex gap-2">
          <Button>Discard</Button>
          <Button color="primary">Save</Button>
        </div>
      </div>
      <div className="flex grow gap-4 overflow-x-scroll px-4 py-2">
        {kanbans.map((kanban, i) => {
          return <Kanban key={i} {...kanban} />;
        })}
      </div>
    </div>
  );
};

const Button: React.FC<{
  color?: "primary" | "default";
  children: ReactNode;
}> = ({ color = "default", children }) => {
  const colorClass = {
    default:
      "bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700",
    primary: "bg-green-700 border border-green-600 hover:bg-green-600",
  };

  return (
    <button
      className={clsx(
        "h-7 rounded-md px-2 text-xs transition-colors",
        colorClass[color],
      )}
    >
      {children}
    </button>
  );
};

const Kanban: React.FC<{
  color: StatusIconColor;
  status: string;
  count: number;
  description: string;
}> = ({ color, status, count, description }) => {
  return (
    <div className="flex h-full w-[350px] shrink-0 flex-col rounded-md border border-neutral-700 bg-neutral-900">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <StatusIcon color={color} />
          <div className="font-bold">{status}</div>
          <CountBadge count={count} />
        </div>
        <div className="flex items-center">
          <button className="grid size-6 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-white/15">
            <MoreHorizontalIcon size={20} />
          </button>
        </div>
      </div>
      <div className="px-4 pb-2 text-sm text-neutral-400">{description}</div>
      <div className="flex grow flex-col gap-2 overflow-auto scroll-auto p-2">
        {[...new Array(count)].map((_, i) => {
          return <KanbanItem key={i} />;
        })}
      </div>
      <div className="grid place-items-center p-1">
        <button className="flex w-full items-center gap-1 rounded-md px-4 py-2 text-neutral-300 transition-colors hover:bg-neutral-800">
          <PlusIcon size={16} />
          <span className="text-sm">Add Item</span>
        </button>
      </div>
    </div>
  );
};

const KanbanItem: React.FC = () => {
  return (
    <div className="group flex cursor-pointer flex-col gap-1 rounded-md border border-neutral-700 bg-neutral-800 p-2 transition-colors hover:border-neutral-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-neutral-400">
          <CircleDashedIcon size={16} strokeWidth={3} />
          <div className="text-xs">Draft</div>
          <button className="grid size-5 place-items-center rounded opacity-0 transition-colors hover:bg-white/15 group-hover:opacity-100">
            <MoreHorizontalIcon size={18} />
          </button>
        </div>
      </div>
      <div className="text-sm">task title</div>
    </div>
  );
};

const SlicerPanel: React.FC = () => {
  return (
    <div className="flex w-[350px] shrink-0 flex-col gap-2 overflow-auto border-r border-neutral-600 p-4">
      <button className="flex h-8 w-fit items-center gap-1 rounded-md px-2 text-sm hover:bg-white/10">
        <span>Status</span>
        <ChevronDownIcon size={16} />
      </button>
      <ul className="w-full [&>li:last-child]:border-b-0">
        {kanbans.map((kanban, i) => {
          return <SlicerListItem key={i} {...kanban} label={kanban.status} />;
        })}
        <SlicerListItem label="No status" count={100} />
      </ul>
    </div>
  );
};

const SlicerListItem: React.FC<{
  active?: boolean;
  color?: StatusIconColor;
  label: string;
  description?: string;
  count: number;
}> = ({ active = false, color = "transparent", label, description, count }) => {
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
          <StatusIcon color={color} />
          <div className="flex flex-col items-start">
            <div className="text-sm">{label}</div>
            {description && (
              <div className="text-xs text-neutral-400">{description}</div>
            )}
          </div>
        </div>
        <CountBadge count={count} />
      </button>
    </li>
  );
};

type StatusIconColor =
  | "green"
  | "orange"
  | "red"
  | "purple"
  | "gray"
  | "transparent";
const StatusIcon: React.FC<{ color: StatusIconColor }> = ({ color }) => {
  const iconClass = {
    green: "bg-green-600/20 border-green-600",
    orange: "bg-orange-600/20 border-orange-600",
    red: "bg-red-600/20 border-red-600",
    purple: "bg-purple-600/20 border-purple-600",
    gray: "bg-neutral-500/20 border-neutral-500",
    transparent: "bg-transparent border-transparent",
  };

  return (
    <div
      className={clsx(
        "size-4 shrink-0 rounded-full border-2",
        iconClass[color],
      )}
    />
  );
};

const CountBadge: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="grid min-w-6 place-items-center rounded-full bg-white/10 p-1 text-xs text-neutral-400">
      {count}
    </div>
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
        <div className="size-8 shrink-0 rounded-full bg-neutral-300" />
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
        "flex h-6 cursor-pointer items-center text-nowrap rounded-md px-1 text-sm transition-colors hover:bg-white/15",
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
        "flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-600 text-neutral-400 transition-colors hover:bg-white/10",
        RightIcon ? "px-2" : "w-8",
      )}
    >
      <Icon size={18} />
      {RightIcon && <RightIcon size={18} />}
    </button>
  );
};
