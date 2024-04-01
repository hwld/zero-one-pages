"use client";
import clsx from "clsx";
import { Command } from "cmdk";
import {
  ArchiveIcon,
  ArrowDownToLineIcon,
  ArrowUpToLine,
  BookMarkedIcon,
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronDownSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  CircleDotIcon,
  Columns2Icon,
  CopyIcon,
  EyeOffIcon,
  GalleryHorizontalEndIcon,
  GitPullRequestIcon,
  KanbanSquareIcon,
  LayersIcon,
  LineChartIcon,
  ListFilterIcon,
  ListIcon,
  LucideIcon,
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
  Settings2Icon,
  SettingsIcon,
  TableRowsSplitIcon,
  TagIcon,
  TextIcon,
  TrashIcon,
  UploadIcon,
  UsersIcon,
  WorkflowIcon,
  XIcon,
} from "lucide-react";
import React, { useMemo, useState } from "react";
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
import { Divider } from "./_components/divider";
import { DropdownCard } from "./_components/dropdown/card";
import { Tooltip } from "./_components/tooltip";
import { AppHeader } from "./_components/app-header/app-header";
import { useView } from "./_queries/useView";
import { useCreateTask } from "./_queries/useCreateTask";
import {
  View,
  ViewColumn as ViewColumnData,
  ViewTask,
} from "./_mocks/view/api";
import { TaskStatus } from "./_mocks/task-status/store";
import { useDeleteTask } from "./_queries/useDeleteTask";

const GitHubProjectPage: React.FC = () => {
  const { data: view } = useView("1");

  return (
    <div
      className="grid h-[100dvh] w-[100dvw] grid-rows-[64px_48px_minmax(0,1fr)] overflow-hidden bg-neutral-900 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
      <AppHeader />
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
          <SlicerPanel columns={view?.columns ?? []} />
          {view && <MainPanel view={view} />}
        </div>
      </div>
    </div>
  );
};
export default GitHubProjectPage;

const MainPanel: React.FC<{ view: View }> = ({ view }) => {
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
        {view?.columns.map((column) => {
          return (
            <ViewColumn
              key={column.statusId}
              column={column}
              allColumns={view.columns}
            />
          );
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

const ViewColumn: React.FC<{
  allColumns: ViewColumnData[];
  column: ViewColumnData;
}> = ({ allColumns, column }) => {
  const createTaskMutation = useCreateTask();

  const handleCreateTask = () => {
    createTaskMutation.mutate({ title: "task", statusId: column.statusId });
  };

  return (
    <div className="flex h-full w-[350px] shrink-0 flex-col rounded-lg border border-neutral-700 bg-neutral-900">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <StatusIcon color={column.status.color} />
          <div className="font-bold">{column.status.name}</div>
          <CountBadge count={column.tasks.length} />
        </div>
        <div className="flex items-center">
          <ViewColumnMenuTrigger status={column.status}>
            <button className="grid size-6 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-white/15">
              <MoreHorizontalIcon size={20} />
            </button>
          </ViewColumnMenuTrigger>
        </div>
      </div>
      <div className="px-4 pb-2 text-sm text-neutral-400">
        {column.status.description}
      </div>
      <div className="flex grow flex-col gap-2 overflow-auto scroll-auto p-2">
        {column.tasks.map((task) => {
          return (
            <ViewTaskCard key={task.id} task={task} columns={allColumns} />
          );
        })}
      </div>
      <div className="grid place-items-center p-2">
        <button
          className="flex w-full items-center gap-1 rounded-md px-4 py-2 text-neutral-300 transition-colors hover:bg-white/15"
          onClick={handleCreateTask}
        >
          <PlusIcon size={16} />
          <span className="text-sm">Add Item</span>
        </button>
      </div>
    </div>
  );
};

const ViewTaskCard: React.FC<{ task: ViewTask; columns: ViewColumnData[] }> = ({
  task,
  columns,
}) => {
  return (
    <div className="group flex cursor-pointer flex-col gap-1 rounded-md border border-neutral-700 bg-neutral-800 p-2 transition-colors hover:border-neutral-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-neutral-400">
          <CircleDashedIcon size={16} strokeWidth={3} />
          <div className="text-xs">Draft</div>
          <ViewTaskMenuTrigger columns={columns} task={task} />
        </div>
      </div>
      <div className="text-sm">{task.title}</div>
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
    <DropdownCard width={320}>
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
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={LineChartIcon} title="Generate chart" />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={PenIcon} title="Rename view" />
        <DropdownItem
          icon={GalleryHorizontalEndIcon}
          title="Save changes to new view"
        />
        <DropdownItem icon={TrashIcon} title="Delete view" red />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={UploadIcon} title="Export view data" />
      </DropdownItemList>
      <Divider />
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
    </DropdownCard>
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
        <DropdownCard>
          <DropdownItemList>
            <DropdownItem icon={WorkflowIcon} title="Workflows" />
            <DropdownItem icon={ArchiveIcon} title="Archived items" />
            <DropdownItem icon={SettingsIcon} title="Settings" />
            <DropdownItem icon={CopyIcon} title="Make a copy" />
          </DropdownItemList>
          <Divider />
          <DropdownItemGroup group="GitHub Projects">
            <DropdownItem icon={RocketIcon} title="What's new" />
            <DropdownItem icon={MessageSquareIcon} title="Give feedback" />
            <DropdownItem icon={BookOpenIcon} title="GitHub Docs" />
          </DropdownItemGroup>
        </DropdownCard>
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
        <DropdownCard>
          <DropdownItemGroup group="Slice by">
            <DropdownItem icon={UsersIcon} title="Assigness" />
            <DropdownItem icon={ChevronDownSquareIcon} title="Status" />
            <DropdownItem icon={TagIcon} title="Labels" />
            <DropdownItem icon={BookMarkedIcon} title="Repository" />
            <DropdownItem icon={MilestoneIcon} title="Milestone" />
            <DropdownItem icon={XIcon} title="No slicing" />
          </DropdownItemGroup>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};

const ViewColumnMenuTrigger: React.FC<{
  status: TaskStatus;
  children: ReactNode;
}> = ({ status, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
    >
      <Tooltip label={`Actions for column: ${status.name}`}>
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <DropdownCard>
          <DropdownItemGroup group="Items">
            <DropdownItem icon={ArchiveIcon} title="Archive all" />
            <DropdownItem icon={TrashIcon} title="Delete all" red />
          </DropdownItemGroup>
          <Divider />
          <DropdownItemGroup group="Column">
            <DropdownItem icon={Settings2Icon} title="Set limit" />
            <DropdownItem icon={PenIcon} title="Edit details" />
            <DropdownItem icon={EyeOffIcon} title="Hide from view" />
            <DropdownItem icon={TrashIcon} title="Delete" red />
          </DropdownItemGroup>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};

type ViewTaskMenuMode = "close" | "main" | "moveToColumn";
const ViewTaskMenuTrigger: React.FC<{
  columns: ViewColumnData[];
  task: ViewTask;
}> = ({ task, columns }) => {
  const [mode, setMode] = useState<ViewTaskMenuMode>("close");

  const contents = useMemo(() => {
    return {
      close: null,
      main: (
        <ViewTaskCardMenu
          task={task}
          onOpenMoveToColumnMenu={() => setMode("moveToColumn")}
        />
      ),
      moveToColumn: (
        <MoveToColumnMenu
          columns={columns}
          status={task.status}
          onBack={() => setMode("main")}
        />
      ),
    };
  }, [columns, task]);

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

const ViewTaskCardMenu = React.forwardRef<
  HTMLDivElement,
  {
    task: ViewTask;
    onOpenMoveToColumnMenu: () => void;
  }
>(function ViewTaskCardMenu({ task, onOpenMoveToColumnMenu }, ref) {
  const deleteTaskMutation = useDeleteTask();

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id);
  };

  return (
    <DropdownCard ref={ref}>
      <DropdownItemList>
        <DropdownItem icon={CircleDotIcon} title="Convert to issue" />
        <DropdownItem icon={CopyIcon} title="Copy link in project" />
      </DropdownItemList>
      <Divider />
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
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={ArchiveIcon} title="Archive" />
        {/* TODO: confirm dialog */}
        <DropdownItem
          icon={TrashIcon}
          title="Delete from project"
          red
          onClick={handleDeleteTask}
        />
      </DropdownItemList>
    </DropdownCard>
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
      <DropdownCard width={width}>
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
        <Divider />
        {header && (
          <>
            {header}
            <Divider />
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
      </DropdownCard>
    </Command>
  );
});

const MoveToColumnMenu = React.forwardRef<
  HTMLDivElement,
  {
    columns: ViewColumnData[];
    status: TaskStatus;
    onBack: () => void;
  }
>(function MoveToColumnMenu({ columns, status, onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Column...">
      {columns.map((column) => {
        return (
          <Command.Item asChild key={column.statusId}>
            <MoveToColumnItem
              status={column.status}
              active={column.status.name === status.name}
            />
          </Command.Item>
        );
      })}
    </SelectionMenu>
  );
});

const MoveToColumnItem = React.forwardRef<
  HTMLButtonElement,
  { status: TaskStatus; active?: boolean }
>(function MoveToColumnItem({ status, active = false, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className="flex min-h-12 w-full items-start gap-2 rounded-md px-2 py-[6px] transition-colors hover:bg-white/10 data-[selected=true]:bg-white/10"
    >
      <StatusIcon color={status.color} />
      <div className="flex w-full flex-col items-start gap-[2px]">
        <div className="flex w-full items-start justify-between gap-1 text-sm">
          {status.name}
          {active && <CheckIcon size={20} />}
        </div>
        <div className="text-xs text-neutral-400">{status.description}</div>
      </div>
    </button>
  );
});

const SlicerPanel: React.FC<{ columns: ViewColumnData[] }> = ({ columns }) => {
  return (
    <div className="flex w-[350px] shrink-0 flex-col gap-2 overflow-auto border-r border-neutral-600 p-4">
      <SliceByMenuTrigger>
        <button className="flex h-8 w-fit items-center gap-1 rounded-md px-2 text-sm hover:bg-white/10">
          <span>Status</span>
          <ChevronDownIcon size={16} />
        </button>
      </SliceByMenuTrigger>
      <ul className="w-full [&>li:last-child]:border-b-0">
        {columns.map((column) => {
          return <SlicerListItem key={column.statusId} column={column} />;
        })}
      </ul>
    </div>
  );
};

const SlicerListItem: React.FC<{
  active?: boolean;
  column: ViewColumnData;
}> = ({ active = false, column }) => {
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
          column.status.description ? "h-14" : "",
        )}
      >
        <div className="flex items-start gap-2">
          <StatusIcon color={column.status.color} />
          <div className="flex flex-col items-start">
            <div className="text-sm">{column.status.name}</div>
            {column.status.description && (
              <div className="text-xs text-neutral-400">
                {column.status.description}
              </div>
            )}
          </div>
        </div>
        <CountBadge count={column.tasks.length} />
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
