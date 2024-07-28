"use client";

import React, { ComponentPropsWithoutRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Resizable } from "re-resizable";
import { useRef, useState } from "react";
import { PiBellSimple, PiSidebarSimple } from "react-icons/pi";
import { IconType } from "react-icons/lib";

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
        className="bg-neutral-200"
        handleClasses={{ right: handleClass }}
        handleComponent={{ right: handle }}
        enable={{ right: true }}
        minWidth={210}
        defaultSize={{ width: 250 }}
        maxWidth={420}
      >
        <div className="relative flex size-full justify-between p-4">
          <div className="flex h-min w-full justify-between">
            <div></div>
            <div className="flex items-center gap-1">
              <SidebarIconButton icon={PiBellSimple} />
              <SidebarIconButton
                icon={PiSidebarSimple}
                onClick={() => {
                  setIsOpen(false);
                }}
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
      className="grid size-8 place-items-center rounded transition-colors hover:bg-black/10"
    >
      <Icon className="size-5" />
    </button>
  );
};
