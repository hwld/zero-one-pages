"use client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { Command } from "cmdk";
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
  Columns2Icon,
  ComputerIcon,
  CopyIcon,
  EyeOffIcon,
  GalleryHorizontalEndIcon,
  GitPullRequestIcon,
  InboxIcon,
  KanbanSquareIcon,
  LayersIcon,
  LineChartIcon,
  ListFilterIcon,
  ListIcon,
  LucideIcon,
  MenuIcon,
  MessageSquareIcon,
  MilestoneIcon,
  MoreHorizontalIcon,
  MoveHorizontalIcon,
  MoveVerticalIcon,
  PanelRightOpenIcon,
  PenIcon,
  PlusIcon,
  RocketIcon,
  Rows2Icon,
  SearchIcon,
  Settings2Icon,
  SettingsIcon,
  TableRowsSplitIcon,
  TagIcon,
  TerminalIcon,
  TextIcon,
  TrashIcon,
  UploadIcon,
  UsersIcon,
  WorkflowIcon,
  XIcon,
} from "lucide-react";
import React, { ComponentPropsWithoutRef, useMemo, useState } from "react";
import { ReactNode } from "react";
import { DropdownProvider } from "./_components/dropdown/provider";
import { DropdownTrigger } from "./_components/dropdown/trigger";
import {
  DropdownContent,
  DropdownMultiContent,
} from "./_components/dropdown/content";
import {
  DropdownItem,
  DropdownItemGroup,
  DropdownItemList,
  ViewConfigMenuItem,
} from "./_components/dropdown/item";
import { DropdownDivider } from "./_components/dropdown/divider";
import { FloatingCard } from "./_components/floating-card";

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
            <Tooltip label="Insight">
              <ButtonGroupItem position="left" icon={LineChartIcon} />
            </Tooltip>
            <Tooltip label="Project details">
              <ButtonGroupItem icon={PanelRightOpenIcon} />
            </Tooltip>

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
          <KanbanMenuTrigger kanban={kanban}>
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
      <div className="grid place-items-center p-2">
        <button className="flex w-full items-center gap-1 rounded-md px-4 py-2 text-neutral-300 transition-colors hover:bg-white/15">
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

type ViewOptionMenuMode =
  | "close"
  | "main"
  | "fieldsConfig"
  | "columnByConfig"
  | "groupByConfig"
  | "sortByConfig"
  | "fieldSumConfig"
  | "sliceByConfig";

const ViewOptionMenuTrigger: React.FC = () => {
  const [mode, setMode] = useState<ViewOptionMenuMode>("close");

  const contents = useMemo((): Record<ViewOptionMenuMode, ReactNode> => {
    return {
      close: null,
      main: <ViewOptionMenu onChangeMode={setMode} />,
      fieldsConfig: <FieldsConfigMenu onBack={() => setMode("main")} />,
      columnByConfig: <ColumnByConfigMenu onBack={() => setMode("main")} />,
      groupByConfig: <GroupByConfigMenu onBack={() => setMode("main")} />,
      sortByConfig: <SortByConfigMenu onBack={() => setMode("main")} />,
      fieldSumConfig: <FieldSumConfigMenu onBack={() => setMode("main")} />,
      sliceByConfig: <SliceByConfigMenu onBack={() => setMode("main")} />,
    };
  }, []);

  const isOpen = mode !== "close";
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setMode("main");
    } else {
      setMode("close");
    }
  };

  const handlekeEscapeKeydown = () => {
    if (mode === "main") {
      setMode("close");
    } else {
      setMode("main");
    }
  };

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip label="View options">
        <DropdownTrigger>
          <button
            className="flex size-5 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200"
            onClick={() => setMode("main")}
          >
            <ChevronDownIcon size={16} />
          </button>
        </DropdownTrigger>
      </Tooltip>
      <DropdownMultiContent
        mode={mode}
        contents={contents}
        onEscapeKeydown={handlekeEscapeKeydown}
      />
    </DropdownProvider>
  );
};

const ViewOptionMenu: React.FC<{
  onChangeMode: (mode: ViewOptionMenuMode) => void;
}> = ({ onChangeMode }) => {
  return (
    <FloatingCard width={320}>
      <DropdownItemGroup group="configuration">
        <ViewConfigMenuItem
          icon={TextIcon}
          title="Fields"
          value="Title, Assignees, Status, Foo, Bar"
          onClick={() => {
            onChangeMode("fieldsConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={Columns2Icon}
          title="Column by:"
          value="Status"
          onClick={() => {
            onChangeMode("columnByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={Rows2Icon}
          title="Group by"
          value="none"
          onClick={() => {
            onChangeMode("groupByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={MoveVerticalIcon}
          title="Sort by"
          value="manual"
          onClick={() => {
            onChangeMode("sortByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={LayersIcon}
          title="Field sum"
          value="Count"
          onClick={() => {
            onChangeMode("fieldSumConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={TableRowsSplitIcon}
          title="Slice by"
          value="Status"
          onClick={() => {
            onChangeMode("sliceByConfig");
          }}
        />
      </DropdownItemGroup>
      <DropdownDivider />
      <DropdownItemList>
        <DropdownItem icon={LineChartIcon} title="Generate chart" />
      </DropdownItemList>
      <DropdownDivider />
      <DropdownItemList>
        <DropdownItem icon={PenIcon} title="Rename view" />
        <DropdownItem
          icon={GalleryHorizontalEndIcon}
          title="Save changes to new view"
        />
        <DropdownItem icon={TrashIcon} title="Delete view" red />
      </DropdownItemList>
      <DropdownDivider />
      <DropdownItemList>
        <DropdownItem icon={UploadIcon} title="Export view data" />
      </DropdownItemList>
      <DropdownDivider />
      <DropdownItemList>
        <div className="grid h-8 grid-cols-2 gap-2">
          <button className="grow rounded-md text-neutral-300 transition-colors hover:bg-white/15">
            Discard
          </button>
          <button className="grow rounded-md border border-green-500 text-green-500 transition-colors hover:bg-green-500/15">
            Save
          </button>
        </div>
      </DropdownItemList>
    </FloatingCard>
  );
};

const FieldsConfigMenu = React.forwardRef<
  HTMLDivElement,
  {
    onBack: () => void;
  }
>(function FieldsConfigMenu({ onBack }, ref) {
  return (
    <SelectionMenu
      ref={ref}
      header={
        <button className="mx-2 flex h-8 items-center gap-2 rounded-md px-2 transition-colors hover:bg-white/15">
          <PlusIcon size={16} />
          <div className="text-sm">New field</div>
        </button>
      }
      onBack={onBack}
      placeholder="Fields..."
    >
      <Command.Item asChild key="title">
        <ConfigMenuItem icon={ListIcon} title="Title" isSelected={true} />
      </Command.Item>
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={true} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem
          icon={ChevronDownSquareIcon}
          title="Status"
          isSelected={true}
        />
      </Command.Item>
      <Command.Item asChild key="labels">
        <ConfigMenuItem icon={TagIcon} title="Labels" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="linked pull requests">
        <ConfigMenuItem
          icon={GitPullRequestIcon}
          title="Linked pull requests"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="reviewers">
        <ConfigMenuItem icon={UsersIcon} title="Reviewers" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="repository">
        <ConfigMenuItem
          icon={BookMarkedIcon}
          title="repository"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="milestone">
        <ConfigMenuItem
          icon={MilestoneIcon}
          title="Milestone"
          isSelected={false}
        />
      </Command.Item>
    </SelectionMenu>
  );
});

const ColumnByConfigMenu = React.forwardRef<
  HTMLDivElement,
  {
    onBack: () => void;
  }
>(function ColumnByConfigMenu({ onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Column by...">
      <Command.Item asChild key="status">
        <ConfigMenuItem
          icon={ChevronDownSquareIcon}
          title="Status"
          isSelected={true}
        />
      </Command.Item>
    </SelectionMenu>
  );
});

const GroupByConfigMenu = React.forwardRef<
  HTMLDivElement,
  {
    onBack: () => void;
  }
>(function GroupByConfigMenu({ onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Group by...">
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem
          icon={ChevronDownSquareIcon}
          title="Status"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="repository">
        <ConfigMenuItem
          icon={BookMarkedIcon}
          title="repository"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="milestone">
        <ConfigMenuItem
          icon={MilestoneIcon}
          title="Milestone"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="no grouping">
        <ConfigMenuItem icon={XIcon} title="No grouping" isSelected={true} />
      </Command.Item>
    </SelectionMenu>
  );
});

const SortByConfigMenu = React.forwardRef<
  HTMLDivElement,
  {
    onBack: () => void;
  }
>(function SortByConfigMenu({ onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Sort by...">
      <Command.Item asChild key="title">
        <ConfigMenuItem icon={ListIcon} title="Title" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem
          icon={ChevronDownSquareIcon}
          title="Status"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="labels">
        <ConfigMenuItem icon={TagIcon} title="Labels" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="linked pull requests">
        <ConfigMenuItem
          icon={GitPullRequestIcon}
          title="Linked pull requests"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="reviewers">
        <ConfigMenuItem icon={UsersIcon} title="Reviewers" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="repository">
        <ConfigMenuItem
          icon={BookMarkedIcon}
          title="repository"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="milestone">
        <ConfigMenuItem
          icon={MilestoneIcon}
          title="Milestone"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="no sorting">
        <ConfigMenuItem icon={XIcon} title="No sorting" isSelected={true} />
      </Command.Item>
    </SelectionMenu>
  );
});

const FieldSumConfigMenu = React.forwardRef<
  HTMLDivElement,
  {
    onBack: () => void;
  }
>(function FieldSumConfigMenu({ onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Field sum...">
      <Command.Item asChild key="count">
        <ConfigMenuItem title="Count" isSelected={true} />
      </Command.Item>
    </SelectionMenu>
  );
});

const SliceByConfigMenu = React.forwardRef<
  HTMLDivElement,
  {
    onBack: () => void;
  }
>(function SliceByConfigMenu({ onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Slice by...">
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem
          icon={ChevronDownSquareIcon}
          title="Status"
          isSelected={true}
        />
      </Command.Item>
      <Command.Item asChild key="repository">
        <ConfigMenuItem
          icon={BookMarkedIcon}
          title="repository"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="milestone">
        <ConfigMenuItem
          icon={MilestoneIcon}
          title="Milestone"
          isSelected={false}
        />
      </Command.Item>
      <Command.Item asChild key="no grouping">
        <ConfigMenuItem icon={XIcon} title="No slicing" isSelected={false} />
      </Command.Item>
    </SelectionMenu>
  );
});

const ConfigMenuItem = React.forwardRef<
  HTMLButtonElement,
  { icon?: LucideIcon; title: string; isSelected: boolean }
>(function ConfigMenuItem({ icon: Icon, title, isSelected, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className="flex min-h-8 w-full items-center justify-between rounded-md px-2 transition-colors hover:bg-white/15 data-[selected=true]:bg-white/15"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-neutral-400" />}
        <div className="text-sm">{title}</div>
      </div>
      {isSelected && <CheckIcon size={20} />}
    </button>
  );
});

const ProjectMenuTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
    >
      <Tooltip label="View more options">
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <FloatingCard>
          <DropdownItemList>
            <DropdownItem icon={WorkflowIcon} title="Workflows" />
            <DropdownItem icon={ArchiveIcon} title="Archived items" />
            <DropdownItem icon={SettingsIcon} title="Settings" />
            <DropdownItem icon={CopyIcon} title="Make a copy" />
          </DropdownItemList>
          <DropdownDivider />
          <DropdownItemGroup group="GitHub Projects">
            <DropdownItem icon={RocketIcon} title="What's new" />
            <DropdownItem icon={MessageSquareIcon} title="Give feedback" />
            <DropdownItem icon={BookOpenIcon} title="GitHub Docs" />
          </DropdownItemGroup>
        </FloatingCard>
      </DropdownContent>
    </DropdownProvider>
  );
};

const CreateNewMenuTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen}>
      <Tooltip label="Create new...">
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <FloatingCard>
          <DropdownItemList>
            <DropdownItem icon={BookMarkedIcon} title="New repository" />
            <DropdownItem icon={BookDownIcon} title="Import repository" />
          </DropdownItemList>
          <DropdownDivider />
          <DropdownItemList>
            <DropdownItem icon={ComputerIcon} title="New codespace" />
            <DropdownItem icon={CodeIcon} title="New gist" />
          </DropdownItemList>
          <DropdownDivider />
          <DropdownItemList>
            <DropdownItem icon={BuildingIcon} title="New organization" />
            <DropdownItem icon={KanbanSquareIcon} title="New project" />
          </DropdownItemList>
        </FloatingCard>
      </DropdownContent>
    </DropdownProvider>
  );
};

const SliceByMenuTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownContent>
        <FloatingCard>
          <DropdownItemGroup group="Slice by">
            <DropdownItem icon={UsersIcon} title="Assigness" />
            <DropdownItem icon={ChevronDownSquareIcon} title="Status" />
            <DropdownItem icon={TagIcon} title="Labels" />
            <DropdownItem icon={BookMarkedIcon} title="Repository" />
            <DropdownItem icon={MilestoneIcon} title="Milestone" />
            <DropdownItem icon={XIcon} title="No slicing" />
          </DropdownItemGroup>
        </FloatingCard>
      </DropdownContent>
    </DropdownProvider>
  );
};

const KanbanMenuTrigger: React.FC<{ kanban: Kanban; children: ReactNode }> = ({
  kanban,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
    >
      <Tooltip label={`Actions for column: ${kanban.status}`}>
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <FloatingCard>
          <DropdownItemGroup group="Items">
            <DropdownItem icon={ArchiveIcon} title="Archive all" />
            <DropdownItem icon={TrashIcon} title="Delete all" red />
          </DropdownItemGroup>
          <DropdownDivider />
          <DropdownItemGroup group="Column">
            <DropdownItem icon={Settings2Icon} title="Set limit" />
            <DropdownItem icon={PenIcon} title="Edit details" />
            <DropdownItem icon={EyeOffIcon} title="Hide from view" />
            <DropdownItem icon={TrashIcon} title="Delete" red />
          </DropdownItemGroup>
        </FloatingCard>
      </DropdownContent>
    </DropdownProvider>
  );
};

type KanbanItemMenuMode = "close" | "main" | "moveToColumn";
const KanbanItemMenuTrigger: React.FC<{ kanban: Kanban }> = ({ kanban }) => {
  const [mode, setMode] = useState<KanbanItemMenuMode>("close");

  const contents = useMemo(() => {
    return {
      close: null,
      main: (
        <KanbanItemMenu
          onOpenMoveToColumnMenu={() => setMode("moveToColumn")}
        />
      ),
      moveToColumn: (
        <MoveToColumnMenu kanban={kanban} onBack={() => setMode("main")} />
      ),
    };
  }, [kanban]);

  const isOpen = mode !== "close";
  const handleOpenChang = (open: boolean) => {
    if (open) {
      setMode("main");
    } else {
      setMode("close");
    }
  };

  const handleEscapeKeydown = () => {
    if (mode === "moveToColumn") {
      setMode("main");
    } else {
      setMode("close");
    }
  };

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={handleOpenChang}>
      <Tooltip label={`Actions for task`}>
        <DropdownTrigger>
          <button
            key="trigger"
            className={clsx(
              "grid size-5 place-items-center rounded transition-all hover:bg-white/15 focus:bg-white/15 focus:opacity-100 focus-visible:bg-white/15 focus-visible:opacity-100",
              mode != "close"
                ? "bg-white/15 opacity-100"
                : "opacity-0 group-hover:opacity-100",
            )}
          >
            <MoreHorizontalIcon size={18} />
          </button>
        </DropdownTrigger>
      </Tooltip>
      <DropdownMultiContent
        mode={mode}
        contents={contents}
        onEscapeKeydown={handleEscapeKeydown}
      ></DropdownMultiContent>
    </DropdownProvider>
  );
};

const KanbanItemMenu = React.forwardRef<
  HTMLDivElement,
  {
    onOpenMoveToColumnMenu: () => void;
  }
>(function KanbanItemMenu({ onOpenMoveToColumnMenu }, ref) {
  return (
    <FloatingCard ref={ref}>
      <DropdownItemList>
        <DropdownItem icon={CircleDotIcon} title="Convert to issue" />
        <DropdownItem icon={CopyIcon} title="Copy link in project" />
      </DropdownItemList>
      <DropdownDivider />
      <DropdownItemList>
        <DropdownItem icon={ArrowUpToLine} title="Move to top" />
        <DropdownItem icon={ArrowDownToLineIcon} title="Move to top" />
        <DropdownItem
          icon={MoveHorizontalIcon}
          leftIcon={ChevronRightIcon}
          title="Move to column"
          onClick={onOpenMoveToColumnMenu}
        />
      </DropdownItemList>
      <DropdownDivider />
      <DropdownItemList>
        <DropdownItem icon={ArchiveIcon} title="Archive" />
        <DropdownItem icon={TrashIcon} title="Delete from project" red />
      </DropdownItemList>
    </FloatingCard>
  );
});

const SelectionMenu = React.forwardRef<
  HTMLDivElement,
  {
    width?: number;
    header?: ReactNode;
    onBack?: () => void;
    children: ReactNode;
    placeholder?: string;
  }
>(function SelectCommandMenu(
  { width = 250, header, onBack, children, placeholder },
  ref,
) {
  return (
    <Command ref={ref}>
      <FloatingCard width={width}>
        <div className="flex h-8 w-full items-center px-2">
          {onBack && (
            <button
              className=" grid size-6 shrink-0 place-items-center rounded-md bg-neutral-700 transition-colors hover:bg-neutral-600"
              onClick={onBack}
            >
              <ChevronLeftIcon size={18} className="mr-[2px]" />
            </button>
          )}
          <Command.Input
            className="mx-2 block h-full w-full bg-transparent text-sm placeholder:text-neutral-400 focus-within:outline-none"
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <DropdownDivider />
        {header && (
          <>
            {header}
            <DropdownDivider />
          </>
        )}
        <Command.List asChild>
          <DropdownItemList>
            <Command.Empty className="grid h-20 place-items-center text-sm text-neutral-400">
              No results found.
            </Command.Empty>
            {children}
          </DropdownItemList>
        </Command.List>
      </FloatingCard>
    </Command>
  );
});

const MoveToColumnMenu = React.forwardRef<
  HTMLDivElement,
  {
    kanban: Kanban;
    onBack: () => void;
  }
>(function MoveToColumnMenu({ kanban, onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Column...">
      {kanbans.map((k) => {
        return (
          <Command.Item asChild key={k.status}>
            <MoveToColumnItem kanban={k} active={k.status === kanban.status} />
          </Command.Item>
        );
      })}
    </SelectionMenu>
  );
});

const MoveToColumnItem = React.forwardRef<
  HTMLButtonElement,
  { kanban: Kanban; active?: boolean }
>(function MoveToColumnItem({ kanban, active = false, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className="flex min-h-12 w-full items-start gap-2 rounded-md px-2 py-[6px] transition-colors hover:bg-white/10 data-[selected=true]:bg-white/10"
    >
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
      {active && <ViewOptionMenuTrigger />}
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
        <Tooltip label="Issues">
          <HeaderButton icon={CircleDotIcon} />
        </Tooltip>
        <Tooltip label="Pull requests">
          <HeaderButton icon={GitPullRequestIcon} />
        </Tooltip>
        <Tooltip label="You have no unread notifications">
          <HeaderButton icon={InboxIcon} />
        </Tooltip>
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
  {
    icon: LucideIcon;
    rightIcon?: LucideIcon;
  } & ComponentPropsWithoutRef<"button">
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

const Tooltip: React.FC<{
  children: ReactNode;
  label: string;
  disabled?: boolean;
}> = ({ children, label, disabled }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <div>{children}</div>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          {!disabled && (
            <RadixTooltip.Content
              className="flex h-6 items-center rounded bg-neutral-700 px-2 text-xs text-neutral-300"
              sideOffset={8}
            >
              {label}
            </RadixTooltip.Content>
          )}
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
