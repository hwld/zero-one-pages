import clsx from "clsx";
import { IconType } from "@react-icons/all-files/lib";
import { PiCaretRightLight } from "@react-icons/all-files/pi/PiCaretRightLight";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { SidebarListLink } from "./list-item";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes } from "../../_utils/routes";
import Link from "next/link";

type Props = {
  isHeaderActive?: boolean;
  children: ReactNode;
};

export const MyProjectList: React.FC<Props> = ({
  isHeaderActive,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={clsx(
          "group/sidebar flex h-9 w-full items-center justify-between rounded transition-colors",
          isHeaderActive ? "bg-rose-100" : "hover:bg-black/5",
        )}
      >
        <Link
          href={Routes.myProjectList()}
          className={clsx(
            "w-full py-2 pl-2 text-start font-bold",
            isHeaderActive ? "text-rose-700" : "text-stone-500",
          )}
        >
          マイプロジェクト
        </Link>
        <div className="flex h-full items-center gap-1 pr-2">
          <IconButton>
            <Icon icon={PiPlusLight} />
          </IconButton>
          <IconButton
            onClick={() => {
              setIsOpen((s) => !s);
            }}
          >
            <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
              <Icon icon={PiCaretRightLight} />
            </motion.span>
          </IconButton>
        </div>
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
          >
            {children}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const IconButton: React.FC<
  { children: ReactNode } & ComponentPropsWithoutRef<"button">
> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="grid size-6 place-items-center rounded text-stone-700 opacity-0 transition-all hover:bg-black/5 hover:text-stone-900 focus-visible:opacity-100 group-hover/sidebar:opacity-100"
    >
      {children}
    </button>
  );
};

const Icon: React.FC<{ icon: IconType }> = ({ icon: Icon }) => {
  return <Icon className="size-4" />;
};

export const MyProjectListItem: React.FC<{
  id: string;
  currentRoute: string;
  todos: number;
  children: ReactNode;
}> = ({ id, currentRoute, todos, children }) => {
  return (
    <SidebarListLink
      href={Routes.myProject(id)}
      currentRoute={currentRoute}
      icon={PiHashLight}
      right={todos > 0 ? todos : undefined}
    >
      {children}
    </SidebarListLink>
  );
};
