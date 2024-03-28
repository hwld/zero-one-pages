"use client";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { MenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
} from "@radix-ui/react-popover";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArchiveIcon,
  ArrowDownToLineIcon,
  ArrowUpToLine,
  BookDownIcon,
  BookMarkedIcon,
  BookOpenIcon,
  BuildingIcon,
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronDownSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CodeIcon,
  ComputerIcon,
  CopyIcon,
  EyeOffIcon,
  GitPullRequestIcon,
  InboxIcon,
  KanbanSquareIcon,
  LineChartIcon,
  ListFilterIcon,
  LucideIcon,
  MenuIcon,
  MessageSquareIcon,
  MilestoneIcon,
  MoreHorizontalIcon,
  MoveHorizontalIcon,
  PanelRightOpenIcon,
  PenIcon,
  PlusIcon,
  RocketIcon,
  SearchIcon,
  Settings2Icon,
  SettingsIcon,
  TagIcon,
  TerminalIcon,
  TrashIcon,
  UsersIcon,
  WorkflowIcon,
  XIcon,
} from "lucide-react";
import React, { forwardRef, useMemo, useState } from "react";
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
            <ProjectMenuTrigger>
              <ButtonGroupItem position="right" icon={MoreHorizontalIcon} />
            </ProjectMenuTrigger>
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
          return <Kanban key={i} kanban={kanban} />;
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
  kanban: Kanban;
}> = ({ kanban }) => {
  return (
    <div className="flex h-full w-[350px] shrink-0 flex-col rounded-lg border border-neutral-700 bg-neutral-900">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <StatusIcon color={kanban.color} />
          <div className="font-bold">{kanban.status}</div>
          <CountBadge count={kanban.count} />
        </div>
        <div className="flex items-center">
          <KanbanMenuTrigger>
            <button className="grid size-6 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-white/15">
              <MoreHorizontalIcon size={20} />
            </button>
          </KanbanMenuTrigger>
        </div>
      </div>
      <div className="px-4 pb-2 text-sm text-neutral-400">
        {kanban.description}
      </div>
      <div className="flex grow flex-col gap-2 overflow-auto scroll-auto p-2">
        {[...new Array(kanban.count)].map((_, i) => {
          return <KanbanItem key={i} kanban={kanban} />;
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

const KanbanItem: React.FC<{ kanban: Kanban }> = ({ kanban }) => {
  return (
    <div className="group flex cursor-pointer flex-col gap-1 rounded-md border border-neutral-700 bg-neutral-800 p-2 transition-colors hover:border-neutral-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-neutral-400">
          <CircleDashedIcon size={16} strokeWidth={3} />
          <div className="text-xs">Draft</div>
          <KanbanItemMenuTrigger kanban={kanban} />
        </div>
      </div>
      <div className="text-sm">task title</div>
    </div>
  );
};

const ProjectMenuTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RadixDropdown.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixDropdown.Trigger asChild>{children}</RadixDropdown.Trigger>
      <AnimatePresence>
        {isOpen && (
          <RadixDropdown.Portal forceMount>
            <DropdownMenuContent align="end">
              <MenuItemList>
                <MenuItem icon={WorkflowIcon} title="Workflows" />
                <MenuItem icon={ArchiveIcon} title="Archived items" />
                <MenuItem icon={SettingsIcon} title="Settings" />
                <MenuItem icon={CopyIcon} title="Make a copy" />
              </MenuItemList>
              <DropdownMenuDivider />
              <MenuItemGroup group="GitHub Projects">
                <MenuItem icon={RocketIcon} title="What's new" />
                <MenuItem icon={MessageSquareIcon} title="Give feedback" />
                <MenuItem icon={BookOpenIcon} title="GitHub Docs" />
              </MenuItemGroup>
            </DropdownMenuContent>
          </RadixDropdown.Portal>
        )}
      </AnimatePresence>
    </RadixDropdown.Root>
  );
};

const CreateNewMenuTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RadixDropdown.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixDropdown.Trigger asChild>{children}</RadixDropdown.Trigger>
      <AnimatePresence>
        {isOpen && (
          <RadixDropdown.Portal forceMount>
            <DropdownMenuContent align="end">
              <MenuItemList>
                <MenuItem icon={BookMarkedIcon} title="New repository" />
                <MenuItem icon={BookDownIcon} title="Import repository" />
              </MenuItemList>
              <DropdownMenuDivider />
              <MenuItemList>
                <MenuItem icon={ComputerIcon} title="New codespace" />
                <MenuItem icon={CodeIcon} title="New gist" />
              </MenuItemList>
              <DropdownMenuDivider />
              <MenuItemList>
                <MenuItem icon={BuildingIcon} title="New organization" />
                <MenuItem icon={KanbanSquareIcon} title="New project" />
              </MenuItemList>
            </DropdownMenuContent>
          </RadixDropdown.Portal>
        )}
      </AnimatePresence>
    </RadixDropdown.Root>
  );
};

const SliceByMenuTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RadixDropdown.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixDropdown.Trigger asChild>{children}</RadixDropdown.Trigger>
      <AnimatePresence>
        {isOpen && (
          <RadixDropdown.Portal forceMount>
            <DropdownMenuContent align="start">
              <MenuItemGroup group="Slice by">
                <MenuItem icon={UsersIcon} title="Assigness" />
                <MenuItem icon={ChevronDownSquareIcon} title="Status" />
                <MenuItem icon={TagIcon} title="Labels" />
                <MenuItem icon={BookMarkedIcon} title="Repository" />
                <MenuItem icon={MilestoneIcon} title="Milestone" />
                <MenuItem icon={XIcon} title="No slicing" />
              </MenuItemGroup>
            </DropdownMenuContent>
          </RadixDropdown.Portal>
        )}
      </AnimatePresence>
    </RadixDropdown.Root>
  );
};

const KanbanMenuTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RadixDropdown.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixDropdown.Trigger asChild>{children}</RadixDropdown.Trigger>
      <AnimatePresence>
        {isOpen && (
          <RadixDropdown.Portal forceMount>
            <DropdownMenuContent>
              <MenuItemGroup group="Items">
                <MenuItem icon={ArchiveIcon} title="Archive all" />
                <MenuItem icon={TrashIcon} title="Delete all" red />
              </MenuItemGroup>
              <DropdownMenuDivider />
              <MenuItemGroup group="Column">
                <MenuItem icon={Settings2Icon} title="Set limit" />
                <MenuItem icon={PenIcon} title="Edit details" />
                <MenuItem icon={EyeOffIcon} title="Hide from view" />
                <MenuItem icon={TrashIcon} title="Delete" red />
              </MenuItemGroup>
            </DropdownMenuContent>
          </RadixDropdown.Portal>
        )}
      </AnimatePresence>
    </RadixDropdown.Root>
  );
};

const KanbanItemMenuTrigger: React.FC<{ kanban: Kanban }> = ({ kanban }) => {
  const [mode, setMode] = useState<"close" | "main" | "moveToColumn">("close");

  const trigger = useMemo(() => {
    return (
      <button
        onClick={() => {
          setMode("main");
        }}
        key="trigger"
        className={clsx(
          "grid size-5 place-items-center rounded transition-all hover:bg-white/15",
          mode != "close"
            ? "bg-white/15 opacity-100"
            : "opacity-0 group-hover:opacity-100",
        )}
      >
        <MoreHorizontalIcon size={18} />
      </button>
    );
  }, [mode]);

  const content = useMemo(() => {
    switch (mode) {
      case "close": {
        return trigger;
      }
      case "main": {
        return (
          <KanbanItemMenu
            isOpen={mode == "main"}
            trigger={trigger}
            onClose={() => setMode("close")}
            onOpenMoveToColumnMenu={() => setMode("moveToColumn")}
          />
        );
      }
      case "moveToColumn": {
        return (
          <MoveToColumnMenu
            kanban={kanban}
            isOpen={mode == "moveToColumn"}
            trigger={trigger}
            onClose={() => setMode("close")}
            onBack={() => setMode("main")}
          />
        );
      }
      default: {
        throw new Error(mode satisfies never);
      }
    }
  }, [kanban, mode, trigger]);

  return <AnimatePresence mode="wait">{content}</AnimatePresence>;
};

const KanbanItemMenu = React.forwardRef<
  HTMLDivElement,
  {
    trigger: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onOpenMoveToColumnMenu: () => void;
  }
>(function KanbanItemMenu(
  { trigger, isOpen, onClose, onOpenMoveToColumnMenu },
  ref,
) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <RadixDropdown.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      key="main"
    >
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      {isOpen && (
        <RadixDropdown.Portal forceMount>
          <DropdownMenuContent align="start" ref={ref}>
            <MenuItemList>
              <MenuItem icon={CircleDotIcon} title="Convert to issue" />
              <MenuItem icon={CopyIcon} title="Copy link in project" />
            </MenuItemList>
            <DropdownMenuDivider />
            <MenuItemList>
              <MenuItem icon={ArrowUpToLine} title="Move to top" />
              <MenuItem icon={ArrowDownToLineIcon} title="Move to top" />
              <MenuItem
                icon={MoveHorizontalIcon}
                leftIcon={ChevronRightIcon}
                title="Move to column"
                onSelect={(e) => {
                  e.preventDefault();
                  onOpenMoveToColumnMenu();
                }}
              />
            </MenuItemList>
            <DropdownMenuDivider />
            <MenuItemList>
              <MenuItem icon={ArchiveIcon} title="Archive" />
              <MenuItem icon={TrashIcon} title="Delete from project" red />
            </MenuItemList>
          </DropdownMenuContent>
        </RadixDropdown.Portal>
      )}
    </RadixDropdown.Root>
  );
});

const MoveToColumnMenu = React.forwardRef<
  HTMLDivElement,
  {
    kanban: Kanban;
    trigger: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
  }
>(function MoveToColumnMenu({ kanban, trigger, isOpen, onClose, onBack }, ref) {
  return (
    <Popover open={isOpen} key="sub" modal>
      <PopoverAnchor asChild>{trigger}</PopoverAnchor>
      {isOpen && (
        <PopoverPortal forceMount>
          <PopoverContent
            ref={ref}
            asChild
            align="start"
            side="bottom"
            sideOffset={4}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              onBack();
            }}
            onPointerDownOutside={onClose}
          >
            <FloatingCard width={250}>
              <div className="flex h-8 w-full items-center gap-2 px-2">
                <button
                  className="grid size-6 shrink-0 place-items-center rounded-md bg-neutral-700 transition-colors hover:bg-neutral-600"
                  onClick={onBack}
                >
                  <ChevronLeftIcon size={18} />
                </button>
                <input
                  className="block h-full w-full bg-transparent text-sm placeholder:text-neutral-400 focus-within:outline-none"
                  placeholder="Filter options..."
                  autoFocus
                />
              </div>
              <DropdownMenuDivider />
              <MenuItemList>
                {kanbans.map((k, i) => {
                  return (
                    <MoveToColumnItem
                      key={i}
                      kanban={k}
                      active={k.status === kanban.status}
                    />
                  );
                })}
              </MenuItemList>
            </FloatingCard>
          </PopoverContent>
        </PopoverPortal>
      )}
    </Popover>
  );
});

const MoveToColumnItem: React.FC<{ kanban: Kanban; active?: boolean }> = ({
  kanban,
  active = false,
}) => {
  return (
    <button className="flex min-h-12 w-full items-start gap-2 rounded-md px-2 py-[6px] transition-colors hover:bg-white/10">
      <StatusIcon color={kanban.color} />
      <div className="flex w-full flex-col items-start gap-[2px]">
        <div className="flex w-full items-start justify-between gap-1 text-sm">
          {kanban.status}
          {active && <CheckIcon size={20} />}
        </div>
        <div className="text-xs text-neutral-400">{kanban.description}</div>
      </div>
    </button>
  );
};

const DropdownMenuDivider: React.FC = () => {
  return <div className="h-[1px] w-full bg-neutral-700" />;
};

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    align?: "center" | "end" | "start";
    onEscapeKeydown?: MenuContentProps["onEscapeKeyDown"];
  }
>(function DropdownMenuContent(
  { children, align = "end", onEscapeKeydown, ...props },
  ref,
) {
  return (
    <RadixDropdown.Content
      ref={ref}
      {...props}
      onEscapeKeyDown={onEscapeKeydown}
      loop
      asChild
      side="bottom"
      align={align}
      sideOffset={4}
    >
      <FloatingCard>{children}</FloatingCard>
    </RadixDropdown.Content>
  );
});

const FloatingCard = forwardRef<
  HTMLDivElement,
  { children: ReactNode; width?: number }
>(function Card({ children, width = 200, ...props }, ref) {
  return (
    <motion.div
      {...props}
      ref={ref}
      className="flex flex-col gap-2 rounded-lg border border-neutral-700 bg-neutral-800 py-2 text-neutral-200 shadow-2xl"
      initial={{ y: -5, opacity: 0, width }}
      animate={{ y: 0, opacity: 1, width }}
      exit={{ y: -5, opacity: 0, width, transition: { duration: 0.1 } }}
    >
      {children}
    </motion.div>
  );
});

const MenuItemGroup: React.FC<{ group: string; children: ReactNode }> = ({
  group,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <div className="px-4 pb-1 pt-2 text-xs text-neutral-400">{group}</div>
      <MenuItemList>{children}</MenuItemList>
    </div>
  );
};

const MenuItemList: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="px-2">{children}</div>;
};

const MenuItem = React.forwardRef<
  HTMLDivElement,
  {
    icon: LucideIcon;
    title: string;
    red?: boolean;
    disabled?: boolean;
    onSelect?: (e: Event) => void;
    leftIcon?: LucideIcon;
  }
>(function MenuItem(
  { icon: Icon, title, red, disabled, onSelect, leftIcon: LeftIcon, ...props },
  ref,
) {
  return (
    <RadixDropdown.Item
      {...props}
      ref={ref}
      onSelect={onSelect}
      disabled={disabled}
      className={clsx(
        "flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 transition-colors focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        red
          ? "text-red-500 hover:bg-red-500/15 focus-visible:bg-red-500/15"
          : "text-neutral-100 hover:bg-white/15 focus-visible:bg-white/15",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          size={16}
          className={clsx("text-neutral-400", red && "text-red-500")}
        />
        <div className="text-sm">{title}</div>
      </div>
      {LeftIcon && <LeftIcon size={16} className="text-neutral-400" />}
    </RadixDropdown.Item>
  );
});

const SlicerPanel: React.FC = () => {
  return (
    <div className="flex w-[350px] shrink-0 flex-col gap-2 overflow-auto border-r border-neutral-600 p-4">
      <SliceByMenuTrigger>
        <button className="flex h-8 w-fit items-center gap-1 rounded-md px-2 text-sm hover:bg-white/10">
          <span>Status</span>
          <ChevronDownIcon size={16} />
        </button>
      </SliceByMenuTrigger>
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
        "-mb-[1px] flex items-center gap-2 border-neutral-600 px-4 py-2",
        active
          ? "rounded-t-md border-x border-t bg-neutral-800 text-neutral-100"
          : "rounded-md text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100",
      )}
    >
      <Icon size={20} />
      <div className="text-sm">{children}</div>
      {active && (
        <button className="flex size-5 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200">
          <ChevronDownIcon size={16} />
        </button>
      )}
    </Wrapper>
  );
};

const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  {
    icon: LucideIcon;
    position?: "left" | "center" | "right";
  }
>(function ButtonGroupItem({ icon: Icon, position = "center", ...props }, ref) {
  const positionClass = {
    left: "border-x rounded-l-md",
    center: "",
    right: "border-x rounded-r-md",
  };

  return (
    <button
      {...props}
      ref={ref}
      className={clsx(
        "flex h-8 w-9 items-center justify-center border-y border-neutral-700 bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-600",
        positionClass[position],
      )}
    >
      <Icon size={20} />
    </button>
  );
});

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
        <CreateNewMenuTrigger>
          <HeaderButton icon={PlusIcon} rightIcon={ChevronDown} />
        </CreateNewMenuTrigger>
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

const HeaderButton = React.forwardRef<
  HTMLButtonElement,
  { icon: LucideIcon; rightIcon?: LucideIcon }
>(function HeaderButton({ icon: Icon, rightIcon: RightIcon, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={clsx(
        "flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-600 text-neutral-400 transition-colors hover:bg-white/10",
        RightIcon ? "px-2" : "w-8",
      )}
    >
      <Icon size={18} />
      {RightIcon && <RightIcon size={18} />}
    </button>
  );
});
