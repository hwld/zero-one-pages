import clsx from "clsx";
import { IconType } from "@react-icons/all-files/lib";
import { PiCaretRightLight } from "@react-icons/all-files/pi/PiCaretRightLight";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiBrowsersLight } from "@react-icons/all-files/pi/PiBrowsersLight";
import { PiPulseLight } from "@react-icons/all-files/pi/PiPulseLight";
import { PiArrowUpLight } from "@react-icons/all-files/pi/PiArrowUpLight";
import { PiArrowDownLight } from "@react-icons/all-files/pi/PiArrowDownLight";
import { PiPencilSimpleLineLight } from "@react-icons/all-files/pi/PiPencilSimpleLineLight";
import { PiHeartLight } from "@react-icons/all-files/pi/PiHeartLight";
import { PiCopyLight } from "@react-icons/all-files/pi/PiCopyLight";
import { PiShareLight } from "@react-icons/all-files/pi/PiShareLight";
import { PiLinkLight } from "@react-icons/all-files/pi/PiLinkLight";
import { PiSelectionBackgroundLight } from "@react-icons/all-files/pi/PiSelectionBackgroundLight";
import { PiDownloadSimpleLight } from "@react-icons/all-files/pi/PiDownloadSimpleLight";
import { PiUploadSimpleLight } from "@react-icons/all-files/pi/PiUploadSimpleLight";
import { PiEnvelopeSimpleLight } from "@react-icons/all-files/pi/PiEnvelopeSimpleLight";
import { PiListBulletsLight } from "@react-icons/all-files/pi/PiListBulletsLight";
import { PiPuzzlePieceLight } from "@react-icons/all-files/pi/PiPuzzlePieceLight";
import { PiArchiveLight } from "@react-icons/all-files/pi/PiArchiveLight";
import { PiTrashLight } from "@react-icons/all-files/pi/PiTrashLight";
import { SidebarListLink } from "./list-item";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes } from "../../_utils/routes";
import Link from "next/link";
import { Menu, MenuSeparator } from "../menu/menu";
import { MenuButtonItem } from "../menu/item";
import { cn } from "@/lib/utils";

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

export const MyProjectListItem: React.FC<{
  id: string;
  currentRoute: string;
  todos: number;
  children: ReactNode;
}> = ({ id, currentRoute, todos, children }) => {
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
      return todos > 0 ? todos : undefined;
    }

    return (
      <Menu
        width={300}
        placement="right-start"
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
      >
        <MenuButtonItem icon={PiArrowUpLight} label="プロジェクトを上に追加" />
        <MenuButtonItem
          icon={PiArrowDownLight}
          label="プロジェクトを下に追加"
        />
        <MenuSeparator />
        <MenuButtonItem icon={PiPencilSimpleLineLight} label="編集" />
        <MenuButtonItem icon={PiHeartLight} label="お気に入りに追加" />
        <MenuButtonItem icon={PiCopyLight} label="複製" />
        <MenuSeparator />
        <MenuButtonItem icon={PiShareLight} label="共有" />
        <MenuSeparator />
        <MenuButtonItem icon={PiLinkLight} label="プロジェクトリンクをコピー" />
        <MenuSeparator />
        <MenuButtonItem
          icon={PiSelectionBackgroundLight}
          label={
            <div className="flex items-center gap-1">
              テンプレートとして保存する
              <span className="flex h-5 items-center rounded bg-green-100 px-[5px] text-xs font-bold tracking-wider text-green-600">
                NEW
              </span>
            </div>
          }
        />
        <MenuButtonItem icon={PiBrowsersLight} label="テンプレートを見る" />
        <MenuSeparator />
        <MenuButtonItem
          icon={PiDownloadSimpleLight}
          label="CSVからインポート"
        />
        <MenuButtonItem
          icon={PiUploadSimpleLight}
          label="CSVとしてエクスポート"
        />
        <MenuSeparator />
        <MenuButtonItem
          icon={PiEnvelopeSimpleLight}
          label="メールでタスクを追加"
        />
        <MenuButtonItem
          icon={PiListBulletsLight}
          label="プロジェクトカレンダーフィード"
        />
        <MenuSeparator />
        <MenuButtonItem icon={PiPulseLight} label="アクティビティログ" />
        <MenuSeparator />
        <MenuButtonItem icon={PiPuzzlePieceLight} label="拡張機能を追加" />
        <MenuSeparator />
        <MenuButtonItem icon={PiArchiveLight} label="アーカイブ" />
        <MenuButtonItem
          icon={PiTrashLight}
          label="削除"
          variant="destructive"
        />
      </Menu>
    );
  }, [isFocus, isMenuOpen, todos]);

  //TODO: focusしたときにMenuが表示されるようにしたい
  return (
    <SidebarListLink
      href={Routes.myProject(id)}
      currentRoute={currentRoute}
      icon={PiHashLight}
      right={rightNode}
      onPointerEnter={() => setFocus(true)}
      onPointerLeave={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      {children}
    </SidebarListLink>
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
