"use client";

import { useMergeRefs } from "@floating-ui/react";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import { z } from "zod";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ActivityIcon,
  AlertCircleIcon,
  BoxSelectIcon,
  CalendarIcon,
  CheckIcon,
  CircleIcon,
  CommandIcon,
  HomeIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
  PanelRightOpenIcon,
  PencilIcon,
  TextIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { Inter } from "next/font/google";
import {
  FocusEventHandler,
  ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inter = Inter({ subsets: ["latin"] });

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
type Task = z.infer<typeof taskSchema>;

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (title: string) => {
    setTasks((t) => [
      ...t,
      {
        id: crypto.randomUUID(),
        title: title,
        description: "",
        done: false,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      },
    ]);
  };

  const handleChangeStatus = (id: string) => {
    setTasks((tasks) =>
      tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            done: !t.done,
            updatedAt: new Date().toLocaleString(),
          };
        }
        return t;
      }),
    );
  };

  const handleChangeDesc = (id: string, desc: string) => {
    setTasks((tasks) => {
      return tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            description: desc,
            updatedAt: new Date().toLocaleString(),
          };
        }
        return t;
      });
    });
  };

  const handleChangeTitle = (id: string, title: string) => {
    setTasks((tasks) => {
      return tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            title,
            updatedAt: new Date().toLocaleString(),
          };
        }
        return t;
      });
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((t) => t.filter((t) => t.id !== id));
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        focusInput();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div
      className={clsx(
        inter.className,
        "flex h-[100dvh] bg-neutral-100 text-neutral-700",
      )}
    >
      <div className="hidden w-[300px]  flex-col gap-5 rounded-e-md bg-neutral-800 p-5 lg:flex">
        <div className="flex items-center gap-2 px-3 font-bold text-neutral-100">
          <CircleIcon strokeWidth={3} />
          TODODO
        </div>
        <div className="h-[1px] w-full bg-neutral-600" />
        <div className="flex flex-col items-start gap-2">
          <SideBarItem active icon={<HomeIcon />}>
            今日のタスク
          </SideBarItem>
          <SideBarItem icon={<LayoutListIcon />}>過去のタスク</SideBarItem>
          <SideBarItem icon={<CalendarIcon />}>予定</SideBarItem>
        </div>
      </div>
      <div
        className="flex grow flex-col items-center overflow-auto"
        style={{ backgroundImage: "url(/1-bg.svg)", backgroundSize: "200px" }}
      >
        <div className="h-full w-full max-w-3xl shrink-0 ">
          <div className="flex flex-col gap-4 px-3 pb-24 pt-10">
            <h1 className="flex items-center gap-2 font-bold text-neutral-700">
              <HomeIcon strokeWidth={3} size={20} />
              <div className="pt-[3px]">今日のタスク</div>
            </h1>
            <div className="flex flex-col gap-2">
              {tasks.length === 0 && <EmptyTask />}
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => {
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={handleDeleteTask}
                        onChangeStatus={handleChangeStatus}
                        onChangeDesc={handleChangeDesc}
                        onChangeTitle={handleChangeTitle}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 flex max-w-[95%] items-start gap-2 py-5">
          <TaskForm onAddTask={handleAddTask} ref={inputRef} />
          <div className="shrink-0">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const EmptyTask: React.FC = () => {
  return (
    <div className="grid w-full place-items-center gap-1 rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-20">
      <BoxSelectIcon size={80} />
      <div className="text-center">
        <div className="font-bold">タスクが存在しません</div>
        <div>`Ctrl`+`k`または、`Cmd`+`k`を入力し、タスクを追加できます</div>
      </div>
    </div>
  );
};

const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "タスクのタイトルを入力してください")
    .max(100, "タスクのタイトルは100文字以内で入力してください"),
});
type TaskFormData = z.infer<typeof taskFormSchema>;
const TaskForm = forwardRef<
  HTMLInputElement,
  { onAddTask: (title: string) => void }
>(function TaskForm({ onAddTask }, _inputRef) {
  const {
    register,
    formState: { errors },
    handleSubmit: buildHandleSubmit,
    clearErrors,
    reset,
  } = useForm<TaskFormData>({
    defaultValues: { title: "" },
    resolver: zodResolver(taskFormSchema),
  });
  const { ref, onBlur, ...otherRegister } = register("title");
  const inputRef = useMergeRefs([_inputRef, ref]);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur(e);
    clearErrors("title");
  };

  const handleSubmit = buildHandleSubmit((d: TaskFormData) => {
    onAddTask(d.title);
    reset({ title: "" });
  });

  return (
    <Popover.Root open={!!errors.title}>
      <Popover.Anchor asChild>
        <div className="flex h-[50px] w-[300px] max-w-full items-center justify-center overflow-hidden rounded-full bg-neutral-900 shadow-lg  shadow-neutral-800/20 ring-neutral-900 ring-offset-2 ring-offset-neutral-100 transition-all duration-300 ease-in-out focus-within:w-[650px] focus-within:ring">
          <form onSubmit={handleSubmit} className="h-full w-full">
            <input
              ref={inputRef}
              className="h-full w-full bg-transparent pl-5  pr-2 text-neutral-200 placeholder:text-neutral-400 focus:outline-none"
              placeholder="タスクを入力してください..."
              onBlur={handleBlur}
              {...otherRegister}
            />
          </form>
          <div className="mr-2 flex items-center  gap-1 rounded-full bg-white/20 p-2 duration-300">
            <div className="flex items-center text-neutral-50">
              <CommandIcon size={15} />
              <div className="select-none text-sm">K</div>
            </div>
          </div>
        </div>
      </Popover.Anchor>
      <AnimatePresence>
        {errors.title && (
          <Popover.Portal forceMount>
            <Popover.Content
              onOpenAutoFocus={(e) => e.preventDefault()}
              side="top"
              sideOffset={4}
              asChild
            >
              <motion.div
                className="flex items-center gap-1 rounded bg-neutral-900 p-2 text-xs text-red-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <AlertCircleIcon size={18} />
                {errors.title.message}
                <Popover.Arrow className="fill-neutral-900" />
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
});

const SideBarItem: React.FC<{
  children: ReactNode;
  icon: ReactNode;
  active?: boolean;
}> = ({ children, icon, active }) => {
  return (
    <button
      className={clsx(
        "flex w-full items-center justify-start gap-2 rounded px-3 py-2 text-sm transition-all duration-200",
        { "pointer-events-none bg-neutral-100 text-neutral-700": active },
        { "text-neutral-100 hover:bg-white/20": !active },
      )}
    >
      {icon}
      {children}
    </button>
  );
};

const TaskItemButton: React.FC<{ icon: ReactNode; onClick?: () => void }> = ({
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex h-[25px] w-[25px] items-center justify-center rounded p-1 text-neutral-700 transition-all duration-200 hover:bg-neutral-200"
    >
      {icon}
    </button>
  );
};

const Menu: React.FC = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-neutral-100 ring-neutral-900 ring-offset-2 ring-offset-neutral-100 transition-colors duration-200 hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring">
          <MoreHorizontalIcon size="60%" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[300px] origin-[100%_100%] rounded-lg bg-neutral-900 p-3 transition-all duration-200 data-[state=closed]:animate-popoverExit data-[state=open]:animate-popoverEnter"
          sideOffset={12}
          side="top"
          align="end"
        >
          <MenuItem icon={<HomeIcon />}>今日のタスク</MenuItem>
          <MenuItem icon={<LayoutListIcon />}>過去のタスク</MenuItem>
          <MenuItem icon={<CalendarIcon />}>予定</MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const MenuItem: React.FC<{ icon: ReactNode; children: ReactNode }> = ({
  icon,
  children,
}) => {
  return (
    <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded p-2 text-sm text-neutral-200 outline-none transition-all duration-200 hover:bg-white/20 hover:outline-none focus:bg-white/20 focus:outline-none">
      {icon}
      {children}
    </DropdownMenu.Item>
  );
};

const TaskCard: React.FC<{
  task: Task;
  onChangeStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeDesc: (id: string, desc: string) => void;
  onChangeTitle: (id: string, title: string) => void;
}> = ({ task, onChangeStatus, onDelete, onChangeDesc, onChangeTitle }) => {
  const [editable, setEditable] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="just flex w-full items-center justify-between rounded-lg border-2 border-neutral-300 bg-neutral-100 p-3 py-2 text-neutral-700">
      <div className="flex w-full items-center gap-2">
        <div className="relative flex h-[25px] w-[25px] shrink-0 cursor-pointer items-center justify-center">
          <AnimatePresence>
            {task.done && (
              <motion.div
                className="absolute inset-0 rounded-full bg-neutral-900"
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: 1.4,
                  opacity: 0,
                }}
              />
            )}
          </AnimatePresence>
          <input
            id={task.id}
            type="checkbox"
            className="peer absolute h-[25px] w-[25px] cursor-pointer appearance-none rounded-full border-2 border-neutral-300"
            checked={task.done}
            onChange={() => onChangeStatus(task.id)}
          ></input>
          <div
            className={clsx(
              "pointer-events-none absolute inset-0 flex origin-[50%_70%] items-center  justify-center rounded-full bg-neutral-900 text-neutral-100 transition-all duration-200 ease-in-out",
              task.done ? "opacity-100" : "opacity-0",
            )}
          >
            <CheckIcon size="80%" />
          </div>
        </div>
        <EditableTaskTitle
          key={`${task.title}-${editable}`}
          ref={titleInputRef}
          task={task}
          editable={editable}
          onChangeEditable={setEditable}
          onChangeTitle={(title) => onChangeTitle(task.id, title)}
        />
      </div>
      <div className="flex gap-1">
        <TaskItemButton
          icon={<PencilIcon />}
          onClick={() => {
            setEditable((s) => !s);
            setTimeout(() => {
              titleInputRef.current?.focus();
            }, 0);
          }}
        />
        <TaskItemButton
          icon={<PanelRightOpenIcon />}
          onClick={() => setIsDetailOpen(true)}
        />
        <TaskDetailSheet
          task={task}
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          onChangeStatus={onChangeStatus}
          onChangeDesc={onChangeDesc}
        />
        <TaskItemButton
          onClick={() => setIsConfirmDeleteOpen(true)}
          icon={<TrashIcon />}
        />
        <ConfirmTaskDeleteDialog
          task={task}
          isOpen={isConfirmDeleteOpen}
          onOpenChange={setIsConfirmDeleteOpen}
          onConfirm={() => onDelete(task.id)}
        />
      </div>
    </div>
  );
};

const EditableTaskTitle = forwardRef<
  HTMLInputElement,
  {
    task: Task;
    editable: boolean;
    onChangeEditable: (editable: boolean) => void;
    onChangeTitle: (title: string) => void;
  }
>(function EditableTaskTitle(
  { task, editable, onChangeEditable, onChangeTitle },
  _inputRef,
) {
  const {
    register,
    handleSubmit: createHandleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { title: task.title },
    resolver: zodResolver(taskFormSchema),
  });
  const { ref: _ref, onBlur, ...registers } = register("title");

  const ref = useMergeRefs([_inputRef, _ref]);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur(e);
    onChangeEditable(false);
  };

  const handleSubmit = createHandleSubmit((data) => {
    onChangeTitle(data.title);
    onChangeEditable(false);
  });

  return editable ? (
    <Popover.Root open={!!errors.title}>
      <Popover.Anchor asChild>
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            ref={ref}
            className="w-full"
            onBlur={handleBlur}
            {...registers}
          />
        </form>
      </Popover.Anchor>
      <AnimatePresence>
        {errors.title && (
          <Popover.Portal forceMount>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={4}
              arrowPadding={10}
              asChild
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                className="flex gap-1 rounded bg-neutral-900 p-2 text-xs text-red-300"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <AlertCircleIcon size={15} />
                {errors.title.message}
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  ) : (
    <label
      className="cursor-pointer select-none break-all checked:line-through"
      htmlFor={task.id}
    >
      {task.title}
    </label>
  );
});

const TaskDetailSheet: React.FC<{
  task: Task;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (id: string) => void;
  onChangeDesc: (id: string, desc: string) => void;
}> = ({ task, isOpen, onOpenChange, onChangeStatus, onChangeDesc }) => {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 bg-black/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </RadixDialog.Overlay>

            <RadixDialog.Content forceMount asChild>
              <motion.div
                className="fixed bottom-0 right-0 top-0 z-10 w-[450px] max-w-full p-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
              >
                <div className="relative flex h-full w-full flex-col gap-6 overflow-auto rounded-lg border-neutral-300 bg-neutral-100 p-6 text-neutral-700 [&_*]:outline-neutral-900">
                  <RadixDialog.Close asChild>
                    <button className="absolute right-3 top-3 rounded p-1 text-neutral-700 transition-colors hover:bg-black/5">
                      <XIcon />
                    </button>
                  </RadixDialog.Close>
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-500">title</div>
                    <div className="text-2xl font-bold">{task.title}</div>
                    <div className="text-xs text-neutral-500">
                      ID: {task.id}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <ActivityIcon size={18} />
                      <div>状態</div>
                    </div>
                    <div className="ml-2">
                      <TaskStatusBadge
                        done={task.done}
                        onChangeDone={() => onChangeStatus(task.id)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <TextIcon size={18} />
                      <div>説明</div>
                    </div>
                    <TaskDescriptionForm
                      defaultDescription={task.description}
                      onChangeDescription={(desc) =>
                        onChangeDesc(task.id, desc)
                      }
                    />
                  </div>
                </div>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};

const TaskStatusBadge: React.FC<{
  done: boolean;
  onChangeDone: () => void;
}> = ({ done, onChangeDone }) => {
  return (
    <button
      onClick={onChangeDone}
      className={clsx(
        "min-w-[70px] rounded-full border p-1 px-3 font-bold",
        done
          ? "border-green-500 bg-green-50 text-green-500"
          : "border-red-500 bg-red-50 text-red-500",
      )}
    >
      {done ? "完了" : "未完了"}
    </button>
  );
};

const TaskDescriptionForm: React.FC<{
  defaultDescription: string;
  onChangeDescription: (desc: string) => void;
}> = ({ defaultDescription, onChangeDescription }) => {
  const [desc, setDesc] = useState(defaultDescription);
  const isDirty = desc !== defaultDescription;

  return (
    <div className="space-y-1">
      <textarea
        className="h-[300px] w-full resize-none rounded border border-neutral-300 bg-transparent p-3 focus-visible:border-neutral-400 focus-visible:outline-neutral-900"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <AnimatePresence>
        {isDirty && (
          <motion.div
            className="flex justify-between"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div className="flex items-center gap-1">
              <AlertCircleIcon size={18} className="shrink-0" />
              <div className="text-xs">変更が保存されていません</div>
            </div>
            <div className="flex gap-1">
              <button
                className="whitespace-nowrap rounded border border-neutral-300 px-3 py-1 text-sm text-neutral-700 transition-colors hover:bg-black/10"
                onClick={() => setDesc(defaultDescription)}
              >
                変更を取り消す
              </button>
              <button
                className="whitespace-nowrap rounded bg-neutral-900 px-3 py-1 text-sm text-neutral-100 transition-colors hover:bg-neutral-700"
                onClick={() => onChangeDescription(desc)}
              >
                保存
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  titleText: string;
  cancelText: string;
  actionText: string;
  onAction: () => void;
  children: ReactNode;
}> = ({
  isOpen,
  onOpenChange,
  titleText,
  cancelText,
  actionText,
  onAction,
  children,
}) => {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild>
              <motion.div className="fixed inset-0 bg-black/15" />
            </RadixDialog.Overlay>

            <RadixDialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 flex min-h-[200px] w-[500px] max-w-[95%] flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-600"
                initial={{ opacity: 0, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: 1, translateX: "-50%", translateY: "-40%" }}
                exit={{ opacity: 0, translateX: "-50%", translateY: "-50%" }}
              >
                <RadixDialog.Close asChild>
                  <button className="absolute right-2 top-2 rounded p-1 text-neutral-100 transition-colors hover:bg-white/20">
                    <XIcon />
                  </button>
                </RadixDialog.Close>
                <div className="bg-neutral-900 p-4 text-lg font-bold text-neutral-100">
                  {titleText}
                </div>
                <div className="grow p-4">{children}</div>
                <div className="flex justify-end gap-2 p-4">
                  <button
                    className="rounded border border-neutral-300 px-3 py-2 text-sm transition-colors hover:bg-neutral-200"
                    onClick={() => onOpenChange(false)}
                  >
                    {cancelText}
                  </button>
                  <button
                    className="rounded bg-neutral-900 px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-700"
                    onClick={onAction}
                  >
                    {actionText}
                  </button>
                </div>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};

const ConfirmTaskDeleteDialog: React.FC<{
  task: Task;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}> = ({ task, isOpen, onOpenChange, onConfirm }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      titleText="タスクの削除"
      cancelText="キャンセル"
      actionText="削除する"
      onAction={onConfirm}
    >
      <div>
        タスク`
        <span className="mx-1 break-all font-bold text-neutral-900">
          {task.title}
        </span>
        ` を削除してもよろしいですか？
        <br />
        タスクを削除すると、もとに戻すことはできません。
      </div>
    </Dialog>
  );
};
