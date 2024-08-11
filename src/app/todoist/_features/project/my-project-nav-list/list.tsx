import clsx from "clsx";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiBrowsersLight } from "@react-icons/all-files/pi/PiBrowsersLight";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes } from "../../../routes";
import Link from "next/link";
import { Menu } from "../../../_components/menu/menu";
import { MenuButtonItem } from "../../../_components/menu/item";
import { Icon, IconButton, TreeToggleIconButton } from "./icon-button";

type Props = {
  isHeaderActive?: boolean;
  children: ReactNode;
};

export const MyProjectNavList: React.FC<Props> = ({
  isHeaderActive,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

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
        <div className="group flex h-full items-center gap-1 pr-2  opacity-0 focus-within:opacity-100 group-hover/sidebar:opacity-100 has-[*[data-open]]:opacity-100">
          <Menu
            trigger={
              <IconButton>
                <Icon icon={PiPlusLight} />
              </IconButton>
            }
          >
            <MenuButtonItem
              icon={PiHashLight}
              label="プロジェクトを追加"
              description="タスクを計画&アサイン"
            />
            <MenuButtonItem
              icon={PiBrowsersLight}
              label="テンプレートを見る"
              description="プロジェクトテンプレートで始める"
            />
          </Menu>
          <TreeToggleIconButton isOpen={isOpen} onOpenChange={setIsOpen} />
        </div>
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            {children}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
