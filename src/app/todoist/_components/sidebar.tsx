"use client";

import React, { ComponentPropsWithoutRef, ReactNode, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Resizable } from "re-resizable";
import { useRef, useState } from "react";
import {
  PiBellSimple,
  PiCalendarDotsFill,
  PiCalendarDotsLight,
  PiCalendarFill,
  PiCalendarLight,
  PiCaretDown,
  PiMagnifyingGlassLight,
  PiSidebarSimple,
  PiSquaresFourFill,
  PiSquaresFourLight,
  PiTrayFill,
  PiTrayLight,
} from "react-icons/pi";
import { IconType } from "react-icons/lib";
import clsx from "clsx";

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

  // TODO:
  const [activeId, setActiveId] = useState(0);

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
        <div className="relative flex size-full flex-col  p-4">
          <div className="mb-4 flex h-min w-full justify-between">
            <button className="group flex h-8 items-center gap-2 rounded p-2 transition-colors hover:bg-black/5">
              <div className="size-6 rounded-full bg-rose-700" />
              <div className="font-bold">User</div>
              <PiCaretDown className="text-stone-600 group-hover:text-stone-900" />
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

          <ul>
            <SidebarListItem icon={PiMagnifyingGlassLight}>
              検索
            </SidebarListItem>
            <SidebarListItem
              right={3}
              active={activeId === 0}
              icon={activeId === 0 ? PiTrayFill : PiTrayLight}
              onClick={() => setActiveId(0)}
            >
              インボックス
            </SidebarListItem>
            <SidebarListItem
              right={10}
              active={activeId === 1}
              icon={activeId === 1 ? PiCalendarFill : PiCalendarLight}
              onClick={() => setActiveId(1)}
            >
              今日
            </SidebarListItem>
            <SidebarListItem
              active={activeId === 2}
              icon={activeId === 2 ? PiCalendarDotsFill : PiCalendarDotsLight}
              onClick={() => setActiveId(2)}
            >
              近日予定
            </SidebarListItem>
            <SidebarListItem
              active={activeId === 3}
              icon={activeId === 3 ? PiSquaresFourFill : PiSquaresFourLight}
              onClick={() => setActiveId(3)}
            >
              フィルター & ラベル
            </SidebarListItem>
          </ul>
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

const SidebarListItem: React.FC<
  {
    icon: IconType;
    active?: boolean;
    right?: ReactNode;
  } & ComponentPropsWithoutRef<"button">
> = ({ icon: Icon, right, active, children, ...props }) => {
  const mutedTextClass = "text-stone-500";
  const activeTextClass = "text-rose-700";

  return (
    <li>
      <button
        {...props}
        className={clsx(
          "group flex h-9 w-full items-center justify-between gap-2 rounded px-2 transition-colors",
          active ? clsx("bg-rose-100", activeTextClass) : "hover:bg-black/5",
        )}
      >
        <div className="flex min-w-0 items-center gap-1">
          <Icon
            className={clsx(
              "size-6 shrink-0 text-stone-500",
              active ? activeTextClass : mutedTextClass,
            )}
          />
          <div className="truncate">{children}</div>
        </div>
        <div className={clsx(active ? activeTextClass : mutedTextClass)}>
          {right}
        </div>
      </button>
    </li>
  );
};
