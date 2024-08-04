"use client";
import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  Suspense,
  useEffect,
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
import { PiCaretDownBold } from "@react-icons/all-files/pi/PiCaretDownBold";
import { PiMagnifyingGlassLight } from "@react-icons/all-files/pi/PiMagnifyingGlassLight";
import { PiPlusCircleFill } from "@react-icons/all-files/pi/PiPlusCircleFill";
import { PiSidebarSimple } from "@react-icons/all-files/pi/PiSidebarSimple";
import { PiSquaresFourFill } from "@react-icons/all-files/pi/PiSquaresFourFill";
import { PiSquaresFourLight } from "@react-icons/all-files/pi/PiSquaresFourLight";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { PiTrayFill } from "@react-icons/all-files/pi/PiTrayFill";
import { PiArrowCircleUpRightLight } from "@react-icons/all-files/pi/PiArrowCircleUpRightLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiPulseLight } from "@react-icons/all-files/pi/PiPulseLight";
import { PiPrinterLight } from "@react-icons/all-files/pi/PiPrinterLight";
import { PiBookOpenLight } from "@react-icons/all-files/pi/PiBookOpenLight";
import { PiGiftLight } from "@react-icons/all-files/pi/PiGiftLight";
import { PiStarDuotone } from "@react-icons/all-files/pi/PiStarDuotone";
import { PiArrowsClockwiseLight } from "@react-icons/all-files/pi/PiArrowsClockwiseLight";
import { PiSignOutLight } from "@react-icons/all-files/pi/PiSignOutLight";
import { PiQuestionLight } from "@react-icons/all-files/pi/PiQuestionLight";
import { PiLightbulbLight } from "@react-icons/all-files/pi/PiLightbulbLight";
import { PiPuzzlePieceLight } from "@react-icons/all-files/pi/PiPuzzlePieceLight";
import { PiKeyboardLight } from "@react-icons/all-files/pi/PiKeyboardLight";
import { PiGraduationCapLight } from "@react-icons/all-files/pi/PiGraduationCapLight";
import { PiDeviceMobileLight } from "@react-icons/all-files/pi/PiDeviceMobileLight";
import { PiDotFill } from "@react-icons/all-files/pi/PiDotFill";
import { IconType } from "@react-icons/all-files/lib";
import {
  MyProjectListItem,
  MyProjectList,
} from "./my-project-list/my-project-list";
import { SidebarListButton, SidebarListLink } from "./list-item";
import { Routes } from "../../_utils/routes";
import { usePathname, useSearchParams } from "next/navigation";
import { Tooltip, TooltipDelayGroup } from "../tooltip";
import { MenuButtonItem, SubMenuTrigger } from "../menu/item";
import { PiGearLight } from "@react-icons/all-files/pi/PiGearLight";
import { PiCommand } from "@react-icons/all-files/pi/PiCommand";
import { cn } from "@/lib/utils";
import { Menu, MenuSeparator } from "../menu/menu";
import {
  dragEnd,
  dragStart,
  FlatProject,
  moveProject,
  toFlatProjects,
  toProjects,
  updatedProjects,
} from "../../_utils/project";

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
    <TooltipDelayGroup>
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
    </TooltipDelayGroup>
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

  const [flatProjects, setFlatProjects] = useState<FlatProject[]>(
    toFlatProjects([
      {
        id: "1",
        label: "project 1",
        todos: 0,
        expanded: false,
        subProjects: [
          {
            id: "1-1",
            label: "project 1-1",
            todos: 0,
            subProjects: [
              {
                id: "1-1-1",
                label: "project 1-1-1",
                todos: 10,
                subProjects: [],
                expanded: false,
              },
            ],
            expanded: false,
          },
          {
            id: "1-2",
            label: "project 1-2",
            todos: 0,
            subProjects: [],
            expanded: false,
          },
        ],
      },
      {
        id: "2",
        label: "project 2",
        todos: 4,
        subProjects: [],
        expanded: false,
      },
      {
        id: "3",
        label: "project 3",
        todos: 0,
        subProjects: [],
        expanded: false,
      },
      {
        id: "4",
        label: "project 4",
        todos: 9,
        subProjects: [],
        expanded: false,
      },
    ]),
  );

  const handleChangeExpanded = (projectId: string, newExpanded: boolean) => {
    setFlatProjects((flats) => {
      const projects = toProjects(flats);
      return toFlatProjects(
        updatedProjects(projects, projectId, { expanded: newExpanded }),
      );
    });
  };

  const [draggingProjectId, setDraggingProjectId] = useState<null | string>(
    null,
  );

  const removedDescendantsRef = useRef<FlatProject[]>([]);

  const handleDrag = (id: string) => {
    const { results, removedDescendants } = dragStart(flatProjects, id);
    removedDescendantsRef.current = removedDescendants;

    setFlatProjects(results);
    setDraggingProjectId(id);
  };

  const handleSwapProjects = (draggingId: string, dragOverId: string) => {
    setFlatProjects((projects) => {
      const newProjects = moveProject(projects, draggingId, dragOverId);
      return newProjects;
    });
  };

  useEffect(() => {
    const handlePointerUp = () => {
      if (draggingProjectId) {
        setFlatProjects((flats) => {
          return dragEnd(flats, draggingProjectId, removedDescendantsRef.current);
        });
        setDraggingProjectId(null);
      }
    };

    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingProjectId]);

  return (
    <div className="group/sidebar relative flex size-full flex-col gap-3 p-3">
      <div className="flex h-min w-full justify-between">
        <Menu
          trigger={
            <button className="group/usermenu flex h-8 items-center gap-2 rounded p-2 transition-colors hover:bg-black/5">
              <span className="size-6 rounded-full bg-stone-700" />
              <span className="font-bold">User</span>
              <PiCaretDownBold className="text-stone-600 group-hover/usermenu:text-stone-900" />
            </button>
          }
        >
          <MenuButtonItem
            icon={PiArrowCircleUpRightLight}
            label="Username"
            description="0/5 件のタスク"
            right="O + P"
          />
          <MenuSeparator />
          <MenuButtonItem icon={PiGearLight} label="設定" right="O + S" />
          <MenuButtonItem icon={PiPlusLight} label="チームを追加" />
          <MenuSeparator />
          <MenuButtonItem
            icon={PiPulseLight}
            label="アクティビティログ"
            right="G + A"
          />
          <MenuButtonItem
            icon={PiPrinterLight}
            label="印刷"
            right={
              <>
                <PiCommand />P
              </>
            }
          />

          <Menu
            trigger={<SubMenuTrigger icon={PiBookOpenLight} label="リソース" />}
          >
            <MenuButtonItem icon={PiQuestionLight} label="ヘルプセンター" />
            <MenuButtonItem
              icon={PiLightbulbLight}
              label="インスピレーション"
            />
            <MenuButtonItem icon={PiPuzzlePieceLight} label="連携機能" />
            <MenuButtonItem
              icon={PiKeyboardLight}
              label="キーボードショートカット"
              right="?"
            />
            <MenuButtonItem icon={PiGraduationCapLight} label="始め方ガイド" />
            <MenuButtonItem
              icon={PiDeviceMobileLight}
              label="アプリをダウンロード"
            />
          </Menu>

          <MenuSeparator />
          <MenuButtonItem icon={PiGiftLight} label="新機能のお知らせ" />
          <MenuSeparator />
          <MenuButtonItem icon={StarIcon} label="プロにアップグレード" />
          <MenuSeparator />
          <MenuButtonItem
            icon={PiArrowsClockwiseLight}
            label="同期"
            right="1時間前"
          />
          <MenuSeparator />
          <MenuButtonItem icon={PiSignOutLight} label="ログアウト" />
          <MenuSeparator />
          <MenuButtonItem
            variant="green"
            icon={PiDotFill}
            label={<p className="font-semibold">最新バージョンに更新する</p>}
          />
        </Menu>
        <div className="flex items-center gap-1">
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

      <ul>
        <li>
          <Tooltip label="タスクを追加" keys={["Q"]} placement="right">
            <TaskCreateButton />
          </Tooltip>
        </li>
        <Tooltip
          label="クイック検索を開く"
          keys={["Cmd", "K"]}
          placement="right"
        >
          <SidebarListButton icon={PiMagnifyingGlassLight}>
            検索
          </SidebarListButton>
        </Tooltip>

        <Tooltip label="インボックスに移動" keys={["G", "I"]} placement="right">
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

      <MyProjectList isHeaderActive={currentRoute === Routes.myProjectList()}>
        {flatProjects.map((project) => {
          return (
            <AnimatePresence key={project.id}>
              {project.visible ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <MyProjectListItem
                    currentRoute={currentRoute}
                    project={project}
                    onChangeExpanded={handleChangeExpanded}
                    onDrag={handleDrag}
                    draggingProjectId={draggingProjectId}
                    onMoveProjects={handleSwapProjects}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          );
        })}
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

const StarIcon: IconType = ({ className, ...props }) => {
  return (
    <PiStarDuotone className={cn(className, "fill-yellow-500")} {...props} />
  );
};
