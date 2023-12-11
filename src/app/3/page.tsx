"use client";

import { IconDots } from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  AnnoyedIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LaughIcon,
  LucideIcon,
} from "lucide-react";
import { NextPage } from "next";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react";
import {
  autoUpdate,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

const initialMenu = [...new Array(3)].map(
  (_, i) => `長いメニューアイテム${i + 1}`,
);
const slimMenu = [...new Array(6)].map((_, i) => `メニュー${i + 1}`);

const Page: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState<1 | 2>(1);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (isOpen) => {
      setIsOpen(isOpen);
    },
    placement: "top-end",
    whileElementsMounted: autoUpdate,
    middleware: [offset(10)],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <div className="flex h-[100dvh] justify-center bg-neutral-900 pt-[50px] text-neutral-900">
      <div className="mt-[500px]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <MenuTrigger ref={refs.setReference} {...getReferenceProps()} />
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <Menu>
                <MenuContent page={page} onPageChange={setPage} />
              </Menu>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;

type MenuProps = {
  children?: ReactNode;
};
const Menu: React.FC<MenuProps> = ({ children }) => {
  // マウント時にはレイアウトアニメーションを実行させたくない。
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // 少し遅延させて、レイアウトアニメーションが実行されないようにする
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  return (
    <motion.div
      key={String(mounted)}
      // マウント後の最初のレンダリングではfalseになる
      layout={mounted}
      className={clsx("flex flex-col gap-1 overflow-hidden bg-neutral-200 p-3")}
      style={{ borderRadius: "8px" }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

type ContentProps = { page: 1 | 2; onPageChange: (page: 1 | 2) => void };
const MenuContent: React.FC<ContentProps> = ({ page, onPageChange }) => {
  useEffect(() => {
    return () => onPageChange(1);
  }, [onPageChange]);

  const content = {
    1: (
      <>
        {initialMenu.map((item, i) => {
          return (
            <MenuItem key={i} icon={AnnoyedIcon}>
              {item}
            </MenuItem>
          );
        })}
        <NextMenuItem onClick={() => onPageChange(2)} />
      </>
    ),
    2: (
      <>
        <BackMenuItem onClick={() => onPageChange(1)} />
        {slimMenu.map((item, i) => {
          return (
            <MenuItem key={i} icon={LaughIcon}>
              {item}
            </MenuItem>
          );
        })}
      </>
    ),
  };

  return content[page];
};

const MenuItem: React.FC<{
  children: ReactNode;
  icon: LucideIcon;
  onClick?: () => void;
}> = ({ children, icon: Icon, onClick }) => {
  return (
    <motion.button
      layout="position"
      className="flex gap-1 rounded p-2 transition-colors hover:bg-black/10"
      onClick={onClick}
    >
      <Icon />
      {children}
    </motion.button>
  );
};

const MenuTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function MenuTrigger(props, ref) {
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
      layout="position"
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
      layout="position"
      className="flex items-center gap-1 px-2 py-1 hover:bg-black/10"
      onClick={onClick}
    >
      <ArrowLeftIcon size={18} />
      <p className="text-sm">戻る</p>
    </motion.button>
  );
};
