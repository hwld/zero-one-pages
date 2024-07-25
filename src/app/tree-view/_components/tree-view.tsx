import clsx from "clsx";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  createContext,
  KeyboardEvent,
  ReactNode,
  useContext,
  useState,
} from "react";

import {
  getFirstFocusableId,
  getLastFocusableId,
  getNextFocusableId,
  getNextFocusableIdByTypeahead,
  getParentFocusableId,
  getPrevFocusableId,
  RovingTabindexItem,
  RovingTabindexRoot,
  useRovingTabindex,
} from "./roving-tabindex";

export type TreeViewState = Map<string, boolean>;

export type TreeViewContextType = {
  open: TreeViewState;
  toggleNode: (id: string, isOpen: boolean) => void;
  selectedId: string | null;
  selectId: (id: string) => void;
};

export const TreeViewContext = createContext<TreeViewContextType | undefined>(
  undefined,
);

const useTreeViewContext = () => {
  const ctx = useContext(TreeViewContext);
  if (!ctx) {
    throw new Error("TreeViewContextが存在しません");
  }
  return ctx;
};

const useTreeViewNodeState = () => {
  // TODO
  const [nodeState, setNodeState] = useState<TreeViewState>(new Map());

  const toggleNode = (id: string, isOpen: boolean) => {
    setNodeState((map) => {
      return new Map(map).set(id, isOpen);
    });
  };

  return { nodeState, toggleNode };
};

type TreeViewProps = {
  children: ReactNode | ReactNode[];
  className?: string;
  value: string | null;
  onChange: (id: string) => void;
  label: string;
};

export const TreeView: React.FC<TreeViewProps> = ({
  children,
  className,
  value,
  onChange,
  label,
}) => {
  const { nodeState, toggleNode } = useTreeViewNodeState();

  return (
    <TreeViewContext.Provider
      value={{
        open: nodeState,
        toggleNode,
        selectedId: value,
        selectId: onChange,
      }}
    >
      <RovingTabindexRoot
        as="ul"
        className={clsx("flex flex-col overflow-auto", className)}
        aria-label={label}
        aria-multiselectable="false"
        role="tree"
      >
        {children}
      </RovingTabindexRoot>
    </TreeViewContext.Provider>
  );
};

export type TreeNodeType = {
  id: string;
  name: string;
  children?: TreeNodeType[];
  icon?: ReactNode;
};

type IconProps = { open?: boolean; className?: string };

export function Arrow({ open, className }: IconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={clsx("origin-center", className)}
      animate={{ rotate: open ? 90 : 0 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </motion.svg>
  );
}

type TreeViewNodeProps = {
  node: TreeNodeType;
};

export const TreeViewNode: React.FC<TreeViewNodeProps> = ({
  node: { id, children, name },
}) => {
  const { open, toggleNode, selectId, selectedId } = useTreeViewContext();
  const { isFocusable, getRovingProps, getOrderedItems } =
    useRovingTabindex(id);
  const isOpen = open.get(id);

  return (
    <li
      {...getRovingProps<"li">({
        className:
          "flex flex-col cursor-pointer select-none focus:outline-none group",
        onKeyDown: function (e: KeyboardEvent) {
          e.stopPropagation();

          const items = getOrderedItems();
          let nextItemToFocus: RovingTabindexItem | undefined;

          if (e.key === "ArrowUp") {
            e.preventDefault();
            nextItemToFocus = getPrevFocusableId(items, id);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            nextItemToFocus = getNextFocusableId(items, id);
          } else if (e.key === "ArrowLeft") {
            if (isOpen && children?.length) {
              toggleNode(id, false);
            } else {
              nextItemToFocus = getParentFocusableId(items, id);
            }
          } else if (e.key === "ArrowRight") {
            if (isOpen && children?.length) {
              nextItemToFocus = getNextFocusableId(items, id);
            } else {
              toggleNode(id, true);
            }
          } else if (e.key === "Home") {
            e.preventDefault();
            nextItemToFocus = getFirstFocusableId(items);
          } else if (e.key === "End") {
            e.preventDefault();
            nextItemToFocus = getLastFocusableId(items);
          } else if (/^[a-z]$/i.test(e.key)) {
            nextItemToFocus = getNextFocusableIdByTypeahead(items, id, e.key);
          } else if (e.key === " ") {
            e.preventDefault();
            selectId(id);
          }
          nextItemToFocus?.element.focus();
        },
        ["aria-expanded"]: children?.length ? Boolean(isOpen) : undefined,
        ["aria-selected"]: selectedId === id,
        role: "treeitem",
      })}
    >
      <MotionConfig
        transition={{
          ease: [0.164, 0.84, 0.43, 1],
          duration: 0.25,
        }}
      >
        <div
          className={clsx(
            "flex items-center space-x-2 border-[1.5px] border-transparent px-1 font-mono font-medium",
            isFocusable && "group-focus:border-slate-500",
            selectedId === id ? "bg-slate-200" : "bg-transparent",
          )}
          onClick={() => {
            toggleNode(id, !isOpen);
            selectId(id);
          }}
        >
          {children?.length ? (
            <Arrow className="h-4 w-4 shrink-0" open={isOpen} />
          ) : (
            <span className="h-4 w-4" />
          )}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </span>
        </div>
        <AnimatePresence initial={false}>
          {children?.length && isOpen && (
            <motion.ul
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.25,
                  },
                  opacity: {
                    duration: 0.2,
                    delay: 0.05,
                  },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: 0.25,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              }}
              key={"ul"}
              role="group"
              className="relative pl-4"
            >
              {children.map((node) => (
                <TreeViewNode node={node} key={node.id} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </MotionConfig>
    </li>
  );
};

export const Treeview = { Root: TreeView, Node: TreeViewNode };
