"use client";
import React, { ComponentPropsWithoutRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Resizable } from "re-resizable";
import { useRef, useState } from "react";
import {
  PiBellSimple,
  PiCalendarDotsFill,
  PiCalendarDotsLight,
  PiCalendarFill,
  PiCalendarLight,
  PiCaretDownLight,
  PiMagnifyingGlassLight,
  PiPlusCircleFill,
  PiSidebarSimple,
  PiSquaresFourFill,
  PiSquaresFourLight,
  PiTrayFill,
  PiTrayLight,
} from "react-icons/pi";
import { IconType } from "react-icons/lib";
import { MyProjectListItem, MyProjectList } from "./my-project-list";
import { SidebarListButton, SidebarListLink } from "./list-item";
import { Routes } from "../../_utils/routes";
import { usePathname, useSearchParams } from "next/navigation";

export const Sidebar: React.FC = () => {
  const paths = usePathname();
  const searchParams = useSearchParams();

  const currentRoute = useMemo(() => {
    if (paths === Routes.myProject()) {
      const id = searchParams.get("id");
      if (id) {
        return Routes.myProject(id);
      }
    }

    return paths;
  }, [paths, searchParams]);

  const resizableRef = useRef<Resizable>(null);

  const [isOpen, setIsOpen] = useState(true);
  const marginLeft = useMemo(() => {
    if (isOpen) {
      return 0;
    }

    const barWidth = resizableRef.current?.size.width;
    return barWidth ? -barWidth : 0;
  }, [isOpen]);

  const handleClass = "flex justify-center group";
  const handle = (
    <div className="h-full w-1 transition-colors group-hover:bg-black/10 group-active:bg-black/20" />
  );

  return (
    <motion.div className="flex" animate={{ marginLeft }}>
      <Resizable
        ref={resizableRef}
        className="bg-stone-200/40"
        handleClasses={{ right: handleClass }}
        handleComponent={{ right: handle }}
        enable={{ right: true }}
        minWidth={210}
        defaultSize={{ width: 250 }}
        maxWidth={420}
      >
        <div className="group/sidebar relative flex size-full flex-col gap-4 p-3">
          <div className="flex h-min w-full justify-between">
            <button className="group/usermenu flex h-8 items-center gap-2 rounded p-2 transition-colors hover:bg-black/5">
              <span className="size-6 rounded-full bg-stone-700" />
              <span className="font-bold">User</span>
              <PiCaretDownLight className="text-stone-600 group-hover/usermenu:text-stone-900" />
            </button>
            <div className="flex items-center gap-1">
              <SidebarIconButton icon={PiBellSimple} />
              <SidebarIconButton
                icon={PiSidebarSimple}
                onClick={() => {
                  setIsOpen(false);
                }}
                style={{ opacity: isOpen ? 1 : 0 }}
              />
            </div>
          </div>
          <AnimatePresence>
            {isOpen ? null : (
              <motion.div
                className="absolute left-full ml-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SidebarIconButton
                  icon={PiSidebarSimple}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-[1px] w-full bg-stone-200" />

          <TaskCreateButton />

          <ul>
            <SidebarListButton icon={PiMagnifyingGlassLight}>
              検索
            </SidebarListButton>
            <SidebarListLink
              href={Routes.inbox()}
              currentRoute={currentRoute}
              icon={PiTrayLight}
              activeIcon={PiTrayFill}
              right={3}
            >
              インボックス
            </SidebarListLink>
            <SidebarListLink
              href={Routes.today()}
              currentRoute={currentRoute}
              icon={PiCalendarLight}
              activeIcon={PiCalendarFill}
              right={10}
            >
              今日
            </SidebarListLink>
            <SidebarListLink
              href={Routes.upcoming()}
              currentRoute={currentRoute}
              icon={PiCalendarDotsLight}
              activeIcon={PiCalendarDotsFill}
            >
              近日予定
            </SidebarListLink>
            <SidebarListLink
              href={Routes.filtersLabels()}
              currentRoute={currentRoute}
              icon={PiSquaresFourLight}
              activeIcon={PiSquaresFourFill}
            >
              フィルター & ラベル
            </SidebarListLink>
          </ul>

          <MyProjectList
            isHeaderActive={currentRoute === Routes.myProjectList()}
          >
            <MyProjectListItem currentRoute={currentRoute} id="1" todos={0}>
              project 1
            </MyProjectListItem>
            <MyProjectListItem currentRoute={currentRoute} id="2" todos={4}>
              project 2
            </MyProjectListItem>
            <MyProjectListItem currentRoute={currentRoute} id="3" todos={0}>
              project 3
            </MyProjectListItem>
            <MyProjectListItem currentRoute={currentRoute} id="4" todos={9}>
              project 4
            </MyProjectListItem>
          </MyProjectList>
        </div>
      </Resizable>
    </motion.div>
  );
};

const SidebarIconButton: React.FC<
  { icon: IconType } & ComponentPropsWithoutRef<"button">
> = ({ icon: Icon, ...props }) => {
  return (
    <button
      {...props}
      className="grid size-8 place-items-center rounded text-stone-600 transition-colors hover:bg-black/5 hover:text-stone-900"
    >
      <Icon className="size-5" />
    </button>
  );
};

const TaskCreateButton: React.FC = () => {
  return (
    <button className="flex h-9 w-full items-center gap-1 rounded p-2 text-rose-700 transition-colors hover:bg-black/5">
      <div className="grid size-7 place-items-center">
        <PiPlusCircleFill className="size-7" />
      </div>
      <div className="font-bold">タスクを作成</div>
    </button>
  );
};
