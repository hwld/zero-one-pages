"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import {
  CalendarIcon,
  CheckIcon,
  CommandIcon,
  CopyCheckIcon,
  HomeIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Inter } from "next/font/google";
import { ReactNode, SyntheticEvent, useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([
    "zero-one-pagesにページを追加する",
    "GraphQLの勉強をする",
    "OpenAPIを使ってみる",
  ]);

  const handleAddTask = (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTasks((t) => [...t, task]);
    setTask("");
  };

  const handleDeleteTask = (i: number) => {
    setTasks((t) => t.filter((t, index) => index !== i));
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
    <div className={clsx(inter.className, "flex h-[100dvh] bg-neutral-100 ")}>
      <div className="hidden w-[300px]  flex-col gap-5 rounded-e-md bg-neutral-800 p-5 lg:flex">
        <div className="flex items-center gap-2 font-bold text-neutral-100">
          <CopyCheckIcon size={20} />
          todo-list
        </div>
        <div className="h-[1px] w-full bg-gray-600" />
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
        <div className="h-full w-full max-w-5xl shrink-0 ">
          <div className="flex flex-col gap-5 px-3 pb-24 pt-10">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-700">
              <HomeIcon strokeWidth={3} />
              <div>今日のタスク</div>
            </h1>
            <div className="flex flex-col gap-2">
              {tasks.map((task, i) => {
                return (
                  <div
                    key={i}
                    className="just flex w-full items-center justify-between rounded-md border-2 border-neutral-300 bg-neutral-100 p-2 text-neutral-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center">
                        <input
                          id={`todo-${i}`}
                          type="checkbox"
                          className="peer absolute h-[30px] w-[30px] appearance-none rounded border-2 border-neutral-300"
                        ></input>
                        <div className="pointer-events-none absolute inset-[0.25rem] flex origin-[50%_70%] scale-0 items-center  justify-center rounded bg-neutral-700 text-neutral-100 transition-all duration-200 ease-in-out peer-checked:scale-100">
                          <CheckIcon strokeWidth={3} />
                        </div>
                      </div>
                      <label
                        className="cursor-pointer select-none checked:line-through"
                        htmlFor={`todo-${i}`}
                      >
                        {task}
                      </label>
                    </div>
                    <div className="flex gap-1">
                      <TaskItemButton icon={<PencilIcon />} />
                      <TaskItemButton onClick={() => handleDeleteTask(i)} icon={<TrashIcon />} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 m-5 flex max-w-[95%] items-start gap-2">
          <div className="flex h-14 w-[300px] max-w-full items-center justify-center overflow-hidden rounded-full bg-neutral-900 shadow-lg  shadow-neutral-800/20 ring-neutral-500 transition-all duration-300 ease-in-out focus-within:w-[700px]">
            <form onSubmit={handleAddTask} className="h-full w-full">
              <input
                ref={inputRef}
                className="h-full w-full bg-transparent pl-5  pr-2 text-neutral-200 focus:outline-none"
                placeholder="タスクを入力してください..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </form>
            <div className="mr-2 flex items-center  gap-1 rounded-full bg-white/20 p-2 duration-300">
              <div className="flex items-center text-neutral-50">
                <CommandIcon size={15} />
                <div className="select-none text-sm">K</div>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const SideBarItem: React.FC<{ children: ReactNode; icon: ReactNode; active?: boolean }> = ({
  children,
  icon,
  active,
}) => {
  return (
    <button
      className={clsx(
        "flex w-full items-center justify-start gap-2 rounded p-3 transition-all duration-200",
        { "pointer-events-none bg-neutral-100 text-neutral-700": active },
        { "text-neutral-100 hover:bg-white/20": !active },
      )}
    >
      {icon}
      {children}
    </button>
  );
};

const TaskItemButton: React.FC<{ icon: ReactNode; onClick?: () => void }> = ({ icon, onClick }) => {
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
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-neutral-100 transition-all duration-200 hover:bg-neutral-700 focus:outline-none">
          <MoreHorizontalIcon size="60%" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[state=open]:animate-popoverEnter data-[state=closed]:animate-popoverExit min-w-[300px] origin-[100%_100%] rounded-lg bg-neutral-900 p-3 transition-all duration-200"
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

const MenuItem: React.FC<{ icon: ReactNode; children: ReactNode }> = ({ icon, children }) => {
  return (
    <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded p-2 text-sm text-neutral-200 outline-none transition-all duration-200 hover:bg-white/20 hover:outline-none focus:bg-white/20 focus:outline-none">
      {icon}
      {children}
    </DropdownMenu.Item>
  );
};
