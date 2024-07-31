import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "framer-motion";
import {
  HTMLProps,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useEffect,
  forwardRef,
  useContext,
  useRef,
} from "react";

type MenuContext = {
  getItemProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  setHasFocusInside: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

export const MenuContext = createContext<MenuContext>({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => {},
  setHasFocusInside: () => {},
  isOpen: false,
});

type MenuComponentProps = {
  trigger: ReactNode;
  children?: ReactNode;
} & HTMLProps<HTMLButtonElement>;

export const MenuComponent = forwardRef<HTMLButtonElement, MenuComponentProps>(
  function MenuComponent({ children, trigger, ...props }, forwardedRef) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasFocusInside, setHasFocusInside] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const elementsRef = useRef<Array<HTMLButtonElement | null>>([]);
    const parent = useContext(MenuContext);

    const tree = useFloatingTree();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const item = useListItem();

    const isNested = parentId != null;

    const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
      nodeId,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: isNested ? "right-start" : "bottom-start",
      middleware: [offset({ mainAxis: 4 }), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, {
      enabled: isNested,
      delay: { open: 75 },
      handleClose: safePolygon({ blockPointerEvents: true }),
    });
    const click = useClick(context, {
      event: "mousedown",
      toggle: !isNested,
      ignoreMouse: isNested,
    });
    const role = useRole(context, { role: "menu" });
    const dismiss = useDismiss(context, { bubbles: true });
    const listNavigation = useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      nested: isNested,
      onNavigate: setActiveIndex,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } =
      useInteractions([hover, click, role, dismiss, listNavigation]);

    // Event emitter allows you to communicate across tree components.
    // This effect closes all menus when an item gets clicked anywhere
    // in the tree.
    useEffect(() => {
      if (!tree) return;

      function handleTreeClick() {
        setIsOpen(false);
      }

      function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          setIsOpen(false);
        }
      }

      tree.events.on("click", handleTreeClick);
      tree.events.on("menuopen", onSubMenuOpen);

      return () => {
        tree.events.off("click", handleTreeClick);
        tree.events.off("menuopen", onSubMenuOpen);
      };
    }, [tree, nodeId, parentId]);

    useEffect(() => {
      if (isOpen && tree) {
        tree.events.emit("menuopen", { parentId, nodeId });
      }
    }, [tree, isOpen, nodeId, parentId]);

    return (
      <FloatingNode id={nodeId}>
        <Slot
          ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
          tabIndex={
            !isNested ? undefined : parent.activeIndex === item.index ? 0 : -1
          }
          role={isNested ? "menuitem" : undefined}
          data-open={isOpen ? "" : undefined}
          data-nested={isNested ? "" : undefined}
          data-focus-inside={hasFocusInside ? "" : undefined}
          className="data-[open]:bg-black/5"
          {...getReferenceProps(
            parent.getItemProps({
              ...props,
              onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                props.onFocus?.(event);
                setHasFocusInside(false);
                parent.setHasFocusInside(true);
              },
            }),
          )}
        >
          {trigger}
        </Slot>
        <MenuContext.Provider
          value={{
            activeIndex,
            setActiveIndex,
            getItemProps,
            setHasFocusInside,
            isOpen,
          }}
        >
          <FloatingList elementsRef={elementsRef}>
            <AnimatePresence>
              {isOpen && (
                <FloatingPortal>
                  <FloatingFocusManager
                    context={context}
                    modal={false}
                    initialFocus={isNested ? -1 : 0}
                    returnFocus={!isNested}
                  >
                    <div
                      className="focus-visible:outline-none"
                      ref={refs.setFloating}
                      style={floatingStyles}
                      {...getFloatingProps()}
                    >
                      <motion.div
                        className="flex w-[280px] flex-col rounded-lg border border-stone-200 bg-stone-50 py-2 text-sm text-stone-700 shadow-md"
                        initial={{
                          opacity: 0,
                          y: isNested ? 0 : -5,
                          x: isNested ? -5 : 0,
                        }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{
                          opacity: 0,
                          y: isNested ? 0 : -5,
                          x: isNested ? -5 : 0,
                        }}
                        transition={{ duration: 0.1 }}
                      >
                        {children}
                      </motion.div>
                    </div>
                  </FloatingFocusManager>
                </FloatingPortal>
              )}
            </AnimatePresence>
          </FloatingList>
        </MenuContext.Provider>
      </FloatingNode>
    );
  },
);

type MenuProps = MenuComponentProps & HTMLProps<HTMLButtonElement>;

export const Menu = forwardRef<HTMLButtonElement, MenuProps>(
  function Menu(props, ref) {
    const parentId = useFloatingParentNodeId();

    if (parentId === null) {
      return (
        <FloatingTree>
          <MenuComponent {...props} ref={ref} />
        </FloatingTree>
      );
    }

    return <MenuComponent {...props} ref={ref} />;
  },
);

export const MenuSeparator: React.FC = () => {
  return <div className="my-1 h-[1px] w-full bg-stone-200" />;
};
