"use client";

import { IconDots } from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  AnnoyedIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LaughIcon,
  LucideIcon,
} from "lucide-react";
import { NextPage } from "next";
import { ComponentPropsWithoutRef, ReactNode, useMemo, useState } from "react";

const Page: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initial, setInitial] = useState(true);
  const initialMenu = [...new Array(3)].map(
    (_, i) => `メニューアイテム${i + 1}`,
  );
  const slimMenu = [...new Array(8)].map((_, i) => `メニュー${i + 1}`);

  const handleClickTrigger = () => {
    if (isOpen && !initial) {
      setInitial(true);
    }
    setIsOpen((prev) => !prev);
  };

  const menuContent = useMemo(() => {
    if (initial) {
      return (
        <Menu>
          {initialMenu.map((item, i) => {
            return (
              <MenuItem key={i} icon={AnnoyedIcon}>
                {item}
              </MenuItem>
            );
          })}
          <NextMenuItem onClick={() => setInitial(false)} />
        </Menu>
      );
    } else {
      return (
        <Menu slim>
          <BackMenuItem onClick={() => setInitial(true)} />
          {slimMenu.map((item, i) => {
            return (
              <MenuItem key={i} icon={LaughIcon}>
                {item}
              </MenuItem>
            );
          })}
        </Menu>
      );
    }
  }, [initial, initialMenu, slimMenu]);

  return (
    <div className="flex h-[100dvh] justify-center bg-neutral-900 pt-[50px] text-neutral-900">
      <div className="relative flex h-[500px] w-[300px] flex-col items-end justify-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <LayoutGroup>{menuContent}</LayoutGroup>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <MenuTrigger onClick={handleClickTrigger} />
        </motion.div>
      </div>
    </div>
  );
};

export default Page;

const Menu: React.FC<{ children?: ReactNode; slim?: boolean }> = ({
  children,
  slim,
}) => {
  return (
    <div>
      <motion.div
        layout
        className="-mb-[1px] h-[8px] w-full rounded-t-lg bg-neutral-200"
      />
      <motion.div
        layout
        className={clsx(
          "flex flex-col gap-1 overflow-hidden bg-neutral-200 px-3 py-1",
          slim ? "w-[150px]" : "w-[300px]",
        )}
      >
        {children}
      </motion.div>
      <motion.div
        layout
        className="-mt-[1px] h-[8px] w-full rounded-b-lg bg-neutral-200"
      />
    </div>
  );
};

const MenuItem: React.FC<{
  children: ReactNode;
  icon: LucideIcon;
  onClick?: () => void;
}> = ({ children, icon: Icon, onClick }) => {
  return (
    <motion.button
      layout="preserve-aspect"
      className="flex gap-1 rounded p-2 transition-colors hover:bg-black/10"
      onLayoutAnimationStart={() => console.log("start")}
      onClick={onClick}
    >
      <Icon />
      {children}
    </motion.button>
  );
};

const MenuTrigger: React.FC<ComponentPropsWithoutRef<"button">> = (props) => {
  return (
    <button
      {...props}
      className="flex h-[50px] w-[50px] items-center justify-center self-end rounded-full bg-neutral-200 transition-colors hover:bg-neutral-400"
    >
      <IconDots />
    </button>
  );
};

const NextMenuItem: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      layout="preserve-aspect"
      className="flex items-center gap-1 rounded px-3 py-1 hover:bg-black/10"
      onClick={onClick}
    >
      <p className="text-sm">次へ</p>
      <ArrowRightIcon size={18} />
    </motion.button>
  );
};

const BackMenuItem: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      layout="preserve-aspect"
      className="flex items-center gap-1 px-2 py-1 hover:bg-black/10"
      onClick={onClick}
    >
      <ArrowLeftIcon size={18} />
      <p className="text-sm">戻る</p>
    </motion.button>
  );
};
