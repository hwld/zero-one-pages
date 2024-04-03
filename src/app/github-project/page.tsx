"use client";
import clsx from "clsx";
import { Command } from "cmdk";
import {
  ArchiveIcon,
  ArrowDownToLineIcon,
  ArrowUpToLine,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CopyIcon,
  EyeOffIcon,
  LineChartIcon,
  ListFilterIcon,
  MoreHorizontalIcon,
  MoveHorizontalIcon,
  PanelRightOpenIcon,
  PenIcon,
  PlusIcon,
  Settings2Icon,
  TrashIcon,
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
} from "./_components/dropdown/item";
import { Divider } from "./_components/divider";
import { DropdownCard } from "./_components/dropdown/card";
import { Tooltip } from "./_components/tooltip";
import { AppHeader } from "./_components/app-header/app-header";
import { useView } from "./_queries/useView";
import {
  MoveTaskInput,
  View,
  ViewColumn as ViewColumnData,
  ViewTask,
} from "./_mocks/view/api";
import { TaskStatus } from "./_mocks/task-status/store";
import { useDeleteTask } from "./_queries/useDeleteTask";
import { CreateTaskBar } from "./_components/create-task-bar";
import { z } from "zod";
import { useMoveTask } from "./_queries/useMoveTask";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonGroupItem } from "./_components/button-group-item";
import { ProjectMenuTrigger } from "./_components/project-menu-trigger";
import { ViewTab } from "./_components/view-tab";
import { SlicerPanel } from "./_components/slicer-panel/slicer-panel";
import { TaskStatusIcon } from "./_components/task-status-icon";
import { CountBadge } from "./_components/count-badge";

const VIEW_ID = "1";

const GitHubProjectPage: React.FC = () => {
  const { data: view } = useView(VIEW_ID);

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
          <ViewTab active>Kanban1</ViewTab>
          <ViewTab>Kanban2</ViewTab>
          <ViewTab icon={PlusIcon}>New view</ViewTab>
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
  const [createTaskBarState, setCreateTaskBarState] = useState({
    isOpen: false,
    statusId: "",
  });

  const moveTaskMutation = useMoveTask();
  const handleMoveToColumn = (input: { taskId: string; statusId: string }) => {
    const column = view.columns.find((c) => c.statusId === input.statusId);
    if (!column) {
      throw new Error("存在しないstatusIdが指定されました");
    }

    const bottomTask = column.tasks.at(-1);
    const bottomOrder = bottomTask ? bottomTask.order + 0.5 : 1;
    moveTaskMutation.mutate({
      viewId: VIEW_ID,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: bottomOrder,
    });
  };

  return (
    <div className="relative flex min-w-0 grow flex-col">
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
              onMoveToColumn={handleMoveToColumn}
              onClickAddItem={() =>
                setCreateTaskBarState({
                  isOpen: true,
                  statusId: column.statusId,
                })
              }
            />
          );
        })}
      </div>
      <CreateTaskBar
        isOpen={createTaskBarState.isOpen}
        statusId={createTaskBarState.statusId}
        onOpenChange={(open) => {
          setCreateTaskBarState((s) => ({ ...s, isOpen: open }));
        }}
      />
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
  onClickAddItem: () => void;
  onMoveToColumn: (input: { taskId: string; statusId: string }) => void;
}> = ({ allColumns, column, onClickAddItem, onMoveToColumn }) => {
  const [acceptDrop, setAcceptDrop] = useState(false);

  const moveTaskMutation = useMoveTask();

  const handleMoveTask = (data: MoveTaskInput) => {
    moveTaskMutation.mutate({ viewId: VIEW_ID, ...data });
  };
  const handleMoveTaskTop = (input: { taskId: string; statusId: string }) => {
    const topItem = column.tasks.at(0);

    moveTaskMutation.mutate({
      viewId: VIEW_ID,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: topItem ? topItem.order / 2 : 1,
    });
  };

  const handleMoveTaskBottom = (input: {
    taskId: string;
    statusId: string;
  }) => {
    const bottomItem = column.tasks.at(-1);

    moveTaskMutation.mutate({
      viewId: VIEW_ID,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: bottomItem ? bottomItem.order + 0.5 : 1,
    });
  };

  return (
    <div className="flex h-full w-[350px] shrink-0 flex-col rounded-lg border border-neutral-700 bg-neutral-900">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <TaskStatusIcon color={column.status.color} />
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
      <div
        className={clsx(
          "relative flex grow flex-col overflow-auto scroll-auto p-2",
        )}
      >
        <div
          className="h-full w-full"
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
              e.preventDefault();
              e.stopPropagation();
              setAcceptDrop(true);
            }
          }}
          onDragLeave={() => {
            setAcceptDrop(false);
          }}
          onDrop={(e) => {
            if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
              e.preventDefault();
              e.stopPropagation();
              const data = JSON.parse(e.dataTransfer.getData(DRAG_TYPE.task));
              const taskId = z.string().parse(data.taskId);

              moveTaskMutation.mutate({
                taskId,
                statusId: column.statusId,
                viewId: VIEW_ID,
                newOrder: column.tasks.length
                  ? column.tasks[column.tasks.length - 1].order + 1
                  : 1,
              });

              setAcceptDrop(false);
            }
          }}
        >
          {column.tasks.length === 0 && acceptDrop && (
            <div
              className={clsx(droppableClass, "before:left-2 before:right-2")}
            />
          )}
          <AnimatePresence mode="popLayout">
            {column.tasks.map((task, i) => {
              const isTop = i === 0;
              const isBottom = i === column.tasks.length - 1;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ViewTaskCard
                    task={task}
                    columns={allColumns}
                    onMove={handleMoveTask}
                    onMoveTop={isTop ? undefined : handleMoveTaskTop}
                    onMoveBottom={isBottom ? undefined : handleMoveTaskBottom}
                    onMoveToColumn={onMoveToColumn}
                    previousOrder={
                      column.tasks[i - 1] ? column.tasks[i - 1].order : 0
                    }
                    nextOrder={
                      column.tasks[i + 1]
                        ? column.tasks[i + 1].order
                        : task.order + 1
                    }
                    acceptBottomDrop={isBottom && acceptDrop}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <div className="grid place-items-center p-2">
        <button
          className="flex w-full items-center gap-1 rounded-md px-4 py-2 text-neutral-300 transition-colors hover:bg-white/15"
          onClick={onClickAddItem}
        >
          <PlusIcon size={16} />
          <span className="text-sm">Add Item</span>
        </button>
      </div>
    </div>
  );
};

const DRAG_TYPE = {
  task: "application/task",
  column: "application/column",
};

const droppableClass =
  "before:absolute before:h-[4px] before:rounded-full before:bg-blue-500 before:content-['']";

const ViewTaskCard: React.FC<{
  task: ViewTask;
  columns: ViewColumnData[];
  previousOrder: number;
  nextOrder: number;
  acceptBottomDrop?: boolean;
  onMove: (input: MoveTaskInput) => void;
  onMoveToColumn: (input: { taskId: string; statusId: string }) => void;
  onMoveTop:
    | ((input: { taskId: string; statusId: string }) => void)
    | undefined;
  onMoveBottom:
    | ((input: { taskId: string; statusId: string }) => void)
    | undefined;
}> = ({
  task,
  columns,
  previousOrder,
  nextOrder,
  acceptBottomDrop = false,
  onMove,
  onMoveToColumn,
  onMoveTop,
  onMoveBottom,
}) => {
  const [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">(
    "none",
  );

  const handleMoveToColumn = (statusId: string) => {
    onMoveToColumn({ taskId: task.id, statusId });
  };

  const handleMoveTop = onMoveTop
    ? () => {
        onMoveTop?.({ taskId: task.id, statusId: task.status.id });
      }
    : undefined;

  const handleMoveBottom = onMoveBottom
    ? () => {
        onMoveBottom?.({ taskId: task.id, statusId: task.status.id });
      }
    : undefined;

  return (
    <div
      className={clsx(
        "relative py-[3px] before:w-full before:opacity-0",
        droppableClass,
        {
          "before:bottom-[calc(100%-2px)] before:opacity-100":
            acceptDrop === "top",
        },
        {
          "before:top-[calc(100%-2px)] before:opacity-100":
            acceptDrop === "bottom" || acceptBottomDrop,
        },
      )}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const midpoint = (rect.top + rect.bottom) / 2;
          setAcceptDrop(e.clientY <= midpoint ? "top" : "bottom");
        }
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(e) => {
        if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
          e.stopPropagation();

          const data = JSON.parse(e.dataTransfer.getData(DRAG_TYPE.task));
          const taskId = z.string().parse(data.taskId);

          const droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
          const newOrder = (droppedOrder + task.order) / 2;

          onMove({
            taskId,
            statusId: task.status.id,
            newOrder,
          });

          setAcceptDrop("none");
        }
      }}
    >
      <div
        className="group flex cursor-pointer flex-col gap-1 rounded-md border border-neutral-700 bg-neutral-800 p-2 transition-colors hover:border-neutral-600"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData(
            DRAG_TYPE.task,
            JSON.stringify({ taskId: task.id }),
          );
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-neutral-400">
            <CircleDashedIcon size={16} strokeWidth={3} />
            <div className="text-xs">Draft</div>
            <ViewTaskMenuTrigger
              columns={columns}
              task={task}
              onMoveToColumn={handleMoveToColumn}
              onMoveTop={handleMoveTop}
              onMoveBottom={handleMoveBottom}
            />
          </div>
        </div>
        <div className="text-sm">{task.title}</div>
      </div>
    </div>
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
  onMoveToColumn: (statusId: string) => void;
  onMoveTop: (() => void) | undefined;
  onMoveBottom: (() => void) | undefined;
}> = ({ task, columns, onMoveTop, onMoveBottom, onMoveToColumn }) => {
  const [mode, setMode] = useState<ViewTaskMenuMode>("close");

  const contents = useMemo(() => {
    const handleMoveTop = onMoveTop
      ? () => {
          onMoveTop();
          setMode("close");
        }
      : undefined;

    const handleMoveBottom = onMoveBottom
      ? () => {
          onMoveBottom();
          setMode("close");
        }
      : undefined;

    return {
      close: null,
      main: (
        <ViewTaskCardMenu
          task={task}
          onOpenMoveToColumnMenu={() => setMode("moveToColumn")}
          onMoveTop={handleMoveTop}
          onMoveBottom={handleMoveBottom}
        />
      ),
      moveToColumn: (
        <MoveToColumnMenu
          columns={columns}
          status={task.status}
          onBack={() => setMode("main")}
          onClose={() => setMode("close")}
          onMoveToColumn={onMoveToColumn}
        />
      ),
    };
  }, [columns, onMoveBottom, onMoveToColumn, onMoveTop, task]);

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
    onMoveTop: (() => void) | undefined;
    onMoveBottom: (() => void) | undefined;
  }
>(function ViewTaskCardMenu(
  { task, onOpenMoveToColumnMenu, onMoveTop, onMoveBottom },
  ref,
) {
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
        <DropdownItem
          icon={ArrowUpToLine}
          title="Move to top"
          disabled={onMoveTop === undefined}
          onClick={onMoveTop}
        />
        <DropdownItem
          icon={ArrowDownToLineIcon}
          title="Move to bottom"
          disabled={onMoveBottom === undefined}
          onClick={onMoveBottom}
        />
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
    onClose: () => void;
    onMoveToColumn: (statusId: string) => void;
  }
>(function MoveToColumnMenu(
  { columns, status, onBack, onClose: onClose, onMoveToColumn },
  ref,
) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Column...">
      {columns.map((column) => {
        return (
          <Command.Item
            asChild
            key={column.statusId}
            onSelect={() => {
              onMoveToColumn(column.status.id);
              onClose();
            }}
          >
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
      <TaskStatusIcon color={status.color} />
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
