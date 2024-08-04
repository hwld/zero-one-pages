import clsx from "clsx";
import { IconType } from "@react-icons/all-files/lib";
import { PiCaretRightLight } from "@react-icons/all-files/pi/PiCaretRightLight";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiBrowsersLight } from "@react-icons/all-files/pi/PiBrowsersLight";
import { SidebarListLink } from "../list-item";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes } from "../../../_utils/routes";
import Link from "next/link";
import { Menu } from "../../menu/menu";
import { MenuButtonItem } from "../../menu/item";
import { cn } from "@/lib/utils";
import { MyProjectMenu } from "./project-menu";
import { FlatProject } from "@/app/todoist/_utils/project";

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

type MyProjectListItemProps = {
  currentRoute: string;
  project: FlatProject;
  onChangeExpanded: (id: string, expanded: boolean) => void;
};

export const MyProjectListItem: React.FC<MyProjectListItemProps> = ({
  currentRoute,
  project,
  onChangeExpanded,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const timer = useRef(0);

  // Link -> IconButtonの順にfocusを当てるとき、LinkのonBlurですぐにhoverをfalseにすると、
  // その時点IconButtonが消えてしまうので、hoverをfalseにするのを次のイベントループまで遅延させて
  // IconButtonにフォーカスと当てられるようにする
  const setFocus = (focus: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setIsFocus(focus);
    }, 0);
  };

  const rightNode = useMemo(() => {
    if (!isFocus && !isMenuOpen) {
      return project.todos > 0 ? project.todos : undefined;
    }

    return (
      <MyProjectMenu
        onOpenChange={(open) => {
          if (!open) {
            // Menuを閉じたときにIconBUttonにfocusを戻す時間を確保する
            window.setTimeout(() => {
              setIsMenuOpen(false);
            }, 300);
          }
          setIsMenuOpen(true);
        }}
        trigger={
          <IconButton
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          >
            <PiDotsThreeBold className="size-6" />
          </IconButton>
        }
      />
    );
  }, [isFocus, isMenuOpen, project.todos]);

  return (
    <SidebarListLink
      href={Routes.myProject(project.id)}
      currentRoute={currentRoute}
      icon={PiHashLight}
      onPointerEnter={() => setFocus(true)}
      onPointerLeave={() => {
        setFocus(false);
      }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      right={
        <div className="flex items-center gap-1">
          <div className="grid size-6 place-items-center">{rightNode}</div>
          {project.subProjectCount ? (
            <TreeToggleIconButton
              isOpen={project.expanded}
              onOpenChange={(open) => onChangeExpanded(project.id, open)}
            />
          ) : null}
        </div>
      }
      depth={project.depth}
    >
      {project.label}
    </SidebarListLink>
  );
};

const TreeToggleIconButton: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ isOpen, onOpenChange }) => {
  return (
    <IconButton onClick={() => onOpenChange(!isOpen)}>
      <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
        <Icon icon={PiCaretRightLight} />
      </motion.span>
    </IconButton>
  );
};

type IconButtonProps = ComponentPropsWithoutRef<"button">;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "grid size-6 place-items-center rounded text-stone-700 transition-all hover:bg-black/5 hover:text-stone-900",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

const Icon: React.FC<{ icon: IconType }> = ({ icon: Icon }) => {
  return <Icon className="size-4" />;
};
