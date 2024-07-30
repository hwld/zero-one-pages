"use client";
import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  Suspense,
  useMemo,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Resizable } from "re-resizable";
import { useRef, useState } from "react";
import { PiBellSimple } from "@react-icons/all-files/pi/PiBellSimple";
import { PiCalendarDotsFill } from "@react-icons/all-files/pi/PiCalendarDotsFill";
import { PiCalendarDotsLight } from "@react-icons/all-files/pi/PiCalendarDotsLight";
import { PiCalendarFill } from "@react-icons/all-files/pi/PiCalendarFill";
import { PiCalendarLight } from "@react-icons/all-files/pi/PiCalendarLight";
import { PiCaretDownLight } from "@react-icons/all-files/pi/PiCaretDownLight";
import { PiMagnifyingGlassLight } from "@react-icons/all-files/pi/PiMagnifyingGlassLight";
import { PiPlusCircleFill } from "@react-icons/all-files/pi/PiPlusCircleFill";
import { PiSidebarSimple } from "@react-icons/all-files/pi/PiSidebarSimple";
import { PiSquaresFourFill } from "@react-icons/all-files/pi/PiSquaresFourFill";
import { PiSquaresFourLight } from "@react-icons/all-files/pi/PiSquaresFourLight";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { PiTrayFill } from "@react-icons/all-files/pi/PiTrayFill";
import { IconType } from "@react-icons/all-files/lib";
import { MyProjectListItem, MyProjectList } from "./my-project-list";
import { SidebarListButton, SidebarListLink } from "./list-item";
import { Routes } from "../../_utils/routes";
import { usePathname, useSearchParams } from "next/navigation";
import { Tooltip, TooltipDelayGroup } from "../tooltip";

export const Sidebar: React.FC = () => {
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
        <Suspense>
          <SidebarContent isOpen={isOpen} onChangeOpen={setIsOpen} />
        </Suspense>
      </Resizable>
    </motion.div>
  );
};

type ContentProps = { isOpen: boolean; onChangeOpen: (open: boolean) => void };

const SidebarContent: React.FC<ContentProps> = ({ isOpen, onChangeOpen }) => {
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

  return (
    <div className="group/sidebar relative flex size-full flex-col gap-3 p-3">
      <div className="flex h-min w-full justify-between">
        <button className="group/usermenu flex h-8 items-center gap-2 rounded p-2 transition-colors hover:bg-black/5">
          <span className="size-6 rounded-full bg-stone-700" />
          <span className="font-bold">User</span>
          <PiCaretDownLight className="text-stone-600 group-hover/usermenu:text-stone-900" />
        </button>
        <div className="flex items-center gap-1">
          <TooltipDelayGroup>
            <Tooltip label="通知を開く" keys={["O", "N"]}>
              <SidebarIconButton icon={PiBellSimple} />
            </Tooltip>
            <Tooltip label="サイドバーを閉じる" keys={["M"]}>
              <SidebarIconButton
                icon={PiSidebarSimple}
                onClick={() => {
                  onChangeOpen(false);
                }}
                style={{ opacity: isOpen ? 1 : 0 }}
              />
            </Tooltip>
          </TooltipDelayGroup>
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
            <Tooltip
              label="サイドバーを開く"
              keys={["M"]}
              placement="bottom-start"
            >
              <SidebarIconButton
                icon={PiSidebarSimple}
                onClick={() => {
                  onChangeOpen(true);
                }}
              />
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      <TooltipDelayGroup>
        <ul>
          <Tooltip label="タスクを追加" keys={["Q"]} placement="right">
            <TaskCreateButton />
          </Tooltip>
          <Tooltip
            label="クイック検索を開く"
            keys={["Cmd", "K"]}
            placement="right"
          >
            <SidebarListButton icon={PiMagnifyingGlassLight}>
              検索
            </SidebarListButton>
          </Tooltip>

          <Tooltip
            label="インボックスに移動"
            keys={["G", "I"]}
            placement="right"
          >
            <SidebarListLink
              href={Routes.inbox()}
              currentRoute={currentRoute}
              icon={PiTrayLight}
              activeIcon={PiTrayFill}
              right={3}
            >
              インボックス
            </SidebarListLink>
          </Tooltip>

          <Tooltip label="今日に移動" keys={["G", "T"]} placement="right">
            <SidebarListLink
              href={Routes.today()}
              currentRoute={currentRoute}
              icon={PiCalendarLight}
              activeIcon={PiCalendarFill}
              right={10}
            >
              今日
            </SidebarListLink>
          </Tooltip>

          <Tooltip label="近日予定に移動" keys={["G", "U"]} placement="right">
            <SidebarListLink
              href={Routes.upcoming()}
              currentRoute={currentRoute}
              icon={PiCalendarDotsLight}
              activeIcon={PiCalendarDotsFill}
            >
              近日予定
            </SidebarListLink>
          </Tooltip>

          <Tooltip
            label="フィルター&ラベルに移動"
            keys={["G", "V"]}
            placement="right"
          >
            <SidebarListLink
              href={Routes.filtersLabels()}
              currentRoute={currentRoute}
              icon={PiSquaresFourLight}
              activeIcon={PiSquaresFourFill}
            >
              フィルター & ラベル
            </SidebarListLink>
          </Tooltip>
        </ul>
      </TooltipDelayGroup>

      <MyProjectList isHeaderActive={currentRoute === Routes.myProjectList()}>
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
  );
};

type SidebarIconButtonProps = {
  icon: IconType;
} & ComponentPropsWithoutRef<"button">;

const SidebarIconButton = forwardRef<HTMLButtonElement, SidebarIconButtonProps>(
  function SidebarIconButton({ icon: Icon, ...props }, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className="grid size-8 place-items-center rounded text-stone-600 transition-colors hover:bg-black/5 hover:text-stone-900"
      >
        <Icon className="size-5" />
      </button>
    );
  },
);

const TaskCreateButton: React.FC = forwardRef<HTMLButtonElement>(
  function TaskCreateButton(props, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className="flex h-9 w-full items-center gap-1 rounded p-2 text-rose-700 transition-colors hover:bg-black/5"
      >
        <div className="grid size-7 place-items-center">
          <PiPlusCircleFill className="size-7" />
        </div>
        <div className="font-bold">タスクを作成</div>
      </button>
    );
  },
);
