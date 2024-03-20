"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { HomeIcon } from "lucide-react";
import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import { EmptyTask } from "./_components/empty-task";
import { TaskForm } from "./_components/task-form";
import { TaskCard } from "./_components/task-card/task-card";
import { Menu } from "./_components/menu/menu";
import { SideBar } from "./_components/side-bar/side-bar";
import { useTasks } from "./_queries/useTasks";

const inter = Inter({ subsets: ["latin"] });

const Home: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: tasks = [] } = useTasks();

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
      <SideBar />
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
            <div className="flex flex-col gap-1">
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
    </div>
  );
};

export default Home;
