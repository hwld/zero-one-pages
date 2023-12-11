"use client";

import { IconDots } from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  AnnoyedIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LaughIcon,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";
import { NextPage } from "next";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useMemo,
  useState,
} from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

const Page: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initial, setInitial] = useState(true);
  const initialMenu = [...new Array(3)].map(
    (_, i) => `メニューアイテム${i + 1}`,
  );
  const slimMenu = [...new Array(8)].map((_, i) => `メニュー${i + 1}`);

  const menuContent = useMemo(() => {
    if (initial) {
      return (
        <Menu key="menu">
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
        <Menu slim key="menu">
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
        <Dropdown.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <Dropdown.Trigger asChild>
            <MenuTrigger />
          </Dropdown.Trigger>
          <AnimatePresence>
            {isOpen && (
              <Dropdown.Portal forceMount>
                <Dropdown.Content
                  sideOffset={10}
                  side="top"
                  align="end"
                  className="text-neutral-900"
                  forceMount
                >
                  {/* 
                    radix-uiを使うとレイアウトアニメーションが正しく動かない。 
                    radix-uiのContentがtransformで位置を調節してることに関係してそう？
                  */}
                  {menuContent}
                </Dropdown.Content>
              </Dropdown.Portal>
            )}
          </AnimatePresence>
        </Dropdown.Root>
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
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="-mb-[1px] h-[8px] w-full rounded-t-lg bg-neutral-200" />
      <motion.div
        className={clsx(
          "flex flex-col gap-1 overflow-hidden bg-neutral-200 px-3 py-1",
          slim ? "w-[150px]" : "w-[300px]",
        )}
      >
        {children}
      </motion.div>
      <motion.div className="-mt-[1px] h-[8px] w-full rounded-b-lg bg-neutral-200" />
    </motion.div>
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
      onClick={onClick}
    >
      <Icon />
      {children}
    </motion.button>
  );
};

const MenuTrigger: React.FC<ComponentPropsWithoutRef<"button">> =
  forwardRef<HTMLButtonElement>(function MenuTrigger(props, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className="flex h-[50px] w-[50px] items-center justify-center self-end rounded-full bg-neutral-200 transition-colors hover:bg-neutral-400"
      >
        <IconDots />
      </button>
    );
  });

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
