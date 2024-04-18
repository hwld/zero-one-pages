"use client";

import clsx from "clsx";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import { SideBar } from "./_components/side-bar/side-bar";
import { HomeIcon } from "lucide-react";
import { EmptyTask } from "./_components/empty-task";
import { AnimatePresence, motion } from "framer-motion";
import { TaskCard } from "./_components/task-card/task-card";
import { TaskForm } from "./_components/task-form";
import { Menu } from "./_components/menu/menu";
import { useTodo1HomeCommands } from "./commands";
import { useTasks } from "./_queries/use-tasks";

// Static ExportでParallel Routesが動かないっぽいので、page.tsxにnullを返させて
// layoutでページをレンダリングする

type Props = { children: ReactNode };
const Layout: React.FC<Props> = ({ children }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: tasks = [] } = useTasks();

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useTodo1HomeCommands();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const cmdK = e.metaKey && e.key === "k";
      const ctrlK = e.ctrlKey && e.key === "k";
      if (cmdK || ctrlK) {
        e.stopPropagation();
        e.preventDefault();
        focusInput();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className={clsx("flex h-[100dvh] bg-neutral-100 text-neutral-700")}>
      <SideBar />
      <div
        className="flex grow flex-col items-center overflow-auto px-2 pt-10"
        style={{ backgroundImage: "url(/1-bg.svg)", backgroundSize: "200px" }}
      >
        <div className="h-full w-full max-w-3xl shrink-0 ">
          <div className="flex flex-col gap-4 pb-24">
            <h1 className="flex items-center gap-2 font-bold text-neutral-700">
              <HomeIcon strokeWidth={3} size={20} />
              <div className="pt-[3px]">今日のタスク</div>
            </h1>
            <div className="flex flex-col gap-1">
              {tasks.length === 0 && <EmptyTask />}
              <AnimatePresence mode="popLayout" initial={false}>
                {tasks.map((task) => {
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <TaskCard key={task.id} task={task} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 flex max-w-[95%] items-start gap-2 py-5">
          <TaskForm ref={inputRef} />
          <div className="shrink-0">
            <Menu />
          </div>
        </div>
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
};

export default Layout;
